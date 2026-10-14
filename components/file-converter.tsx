'use client'

import { useRef, useState } from 'react'
import type { FFmpeg } from '@ffmpeg/ffmpeg'
import { Download, FileVideo, Loader2, RotateCcw, Upload, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

const FORMATS = [
  { ext: 'mp3', label: 'MP3', kind: 'Audio', mime: 'audio/mpeg', args: ['-vn', '-c:a', 'libmp3lame', '-q:a', '2'] },
  { ext: 'm4a', label: 'M4A', kind: 'Audio', mime: 'audio/mp4', args: ['-vn', '-c:a', 'aac', '-b:a', '192k'] },
  { ext: 'wav', label: 'WAV', kind: 'Audio', mime: 'audio/wav', args: ['-vn'] },
  {
    ext: 'mp4',
    label: 'MP4',
    kind: 'Vidéo',
    mime: 'video/mp4',
    args: ['-c:v', 'libx264', '-preset', 'ultrafast', '-crf', '26', '-c:a', 'aac', '-movflags', '+faststart'],
  },
] as const

type Format = (typeof FORMATS)[number]
type Status = 'idle' | 'loading' | 'converting' | 'done' | 'error'

const MAX_SIZE = 500 * 1024 * 1024
const FFMPEG_MODULE_URL = '/ffmpeg/index.js'
const CORE_BASE = 'https://unpkg.com/@ffmpeg/core@0.12.10/dist/esm'

function formatBytes(bytes: number) {
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} Ko`
  return `${(bytes / 1024 / 1024).toFixed(1)} Mo`
}

export function FileConverter() {
  const ffmpegRef = useRef<FFmpeg | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const [file, setFile] = useState<File | null>(null)
  const [format, setFormat] = useState<Format>(FORMATS[0])
  const [status, setStatus] = useState<Status>('idle')
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<{ url: string; name: string; size: number } | null>(null)
  const [dragging, setDragging] = useState(false)

  function selectFile(selected: File | undefined) {
    if (!selected) return
    if (!selected.type.startsWith('video/') && !selected.type.startsWith('audio/')) {
      setError('Ce fichier n’est pas une vidéo ou un fichier audio.')
      return
    }
    if (selected.size > MAX_SIZE) {
      setError('Fichier trop volumineux (500 Mo maximum).')
      return
    }
    reset()
    setFile(selected)
  }

  function reset() {
    if (result) URL.revokeObjectURL(result.url)
    setResult(null)
    setError(null)
    setProgress(0)
    setStatus('idle')
  }

  async function getFFmpeg() {
    if (ffmpegRef.current?.loaded) return ffmpegRef.current
    // Loaded from /public so its module worker resolves same-origin; bundlers can't analyze its dynamic Worker URL.
    const [{ FFmpeg }, { toBlobURL }] = await Promise.all([
      import(/* webpackIgnore: true */ /* turbopackIgnore: true */ FFMPEG_MODULE_URL) as Promise<
        typeof import('@ffmpeg/ffmpeg')
      >,
      import('@ffmpeg/util'),
    ])
    const ffmpeg = new FFmpeg()
    ffmpeg.on('progress', ({ progress: p }) => setProgress(Math.min(1, Math.max(0, p))))
    await ffmpeg.load({
      coreURL: await toBlobURL(`${CORE_BASE}/ffmpeg-core.js`, 'text/javascript'),
      wasmURL: await toBlobURL(`${CORE_BASE}/ffmpeg-core.wasm`, 'application/wasm'),
    })
    ffmpegRef.current = ffmpeg
    return ffmpeg
  }

  async function convert() {
    if (!file) return
    reset()
    try {
      setStatus('loading')
      const ffmpeg = await getFFmpeg()
      const { fetchFile } = await import('@ffmpeg/util')

      setStatus('converting')
      const inputName = `input.${file.name.split('.').pop() ?? 'bin'}`
      const outputName = `output.${format.ext}`
      await ffmpeg.writeFile(inputName, await fetchFile(file))

      const code = await ffmpeg.exec(['-i', inputName, ...format.args, outputName])
      if (code !== 0) throw new Error('conversion failed')

      const data = await ffmpeg.readFile(outputName)
      await Promise.allSettled([ffmpeg.deleteFile(inputName), ffmpeg.deleteFile(outputName)])

      const blob = new Blob([data as Uint8Array], { type: format.mime })
      const baseName = file.name.replace(/\.[^.]+$/, '')
      setResult({ url: URL.createObjectURL(blob), name: `${baseName}.${format.ext}`, size: blob.size })
      setProgress(1)
      setStatus('done')
    } catch {
      setStatus('error')
      setError('La conversion a échoué. Vérifiez que le fichier contient bien une piste audio ou vidéo.')
    }
  }

  const busy = status === 'loading' || status === 'converting'

  return (
    <div className="flex flex-col gap-5">
      {!file ? (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          onDragOver={(e) => {
            e.preventDefault()
            setDragging(true)
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={(e) => {
            e.preventDefault()
            setDragging(false)
            selectFile(e.dataTransfer.files[0])
          }}
          className={cn(
            'flex flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed px-6 py-10 text-center transition-colors',
            dragging ? 'border-primary bg-primary/10' : 'border-border hover:border-primary/60 hover:bg-muted/50',
          )}
        >
          <span className="flex size-12 items-center justify-center rounded-full bg-primary/15 text-primary">
            <Upload className="size-5" aria-hidden="true" />
          </span>
          <span className="font-medium">Glissez votre vidéo ici ou cliquez pour parcourir</span>
          <span className="text-sm text-muted-foreground">MP4, MOV, WEBM, MKV, AVI, MP3… jusqu&apos;à 500 Mo</span>
        </button>
      ) : (
        <div className="flex items-center gap-3 rounded-xl border bg-muted/40 p-3">
          <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/15 text-primary">
            <FileVideo className="size-5" aria-hidden="true" />
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium">{file.name}</p>
            <p className="text-xs text-muted-foreground">{formatBytes(file.size)}</p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            disabled={busy}
            onClick={() => {
              reset()
              setFile(null)
            }}
            aria-label="Retirer le fichier"
          >
            <X className="size-4" />
          </Button>
        </div>
      )}
      <input
        ref={inputRef}
        type="file"
        accept="video/*,audio/*"
        className="sr-only"
        tabIndex={-1}
        onChange={(e) => {
          selectFile(e.target.files?.[0])
          e.target.value = ''
        }}
      />

      <fieldset className="flex flex-col gap-2" disabled={busy}>
        <legend className="mb-2 text-sm font-medium text-muted-foreground">Format de sortie</legend>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {FORMATS.map((f) => (
            <label
              key={f.ext}
              className={cn(
                'flex cursor-pointer flex-col items-center rounded-lg border px-3 py-2.5 transition-colors has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-ring',
                format.ext === f.ext ? 'border-primary bg-primary/10 text-foreground' : 'hover:bg-muted/60',
              )}
            >
              <input
                type="radio"
                name="format"
                value={f.ext}
                checked={format.ext === f.ext}
                onChange={() => setFormat(f)}
                className="sr-only"
              />
              <span className="font-semibold">{f.label}</span>
              <span className="text-xs text-muted-foreground">{f.kind}</span>
            </label>
          ))}
        </div>
      </fieldset>

      {busy && (
        <div className="flex flex-col gap-2" role="status" aria-live="polite">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">
              {status === 'loading' ? 'Chargement du moteur de conversion…' : 'Conversion en cours…'}
            </span>
            {status === 'converting' && <span className="font-medium tabular-nums">{Math.round(progress * 100)} %</span>}
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-muted">
            <div
              className={cn('h-full rounded-full bg-primary transition-all', status === 'loading' && 'w-1/3 animate-pulse')}
              style={status === 'converting' ? { width: `${Math.max(3, progress * 100)}%` } : undefined}
            />
          </div>
        </div>
      )}

      {error && (
        <p role="alert" className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {error}
        </p>
      )}

      {status === 'done' && result ? (
        <div className="flex flex-col gap-2 sm:flex-row">
          <Button size="lg" className="h-12 flex-1 text-base" render={<a href={result.url} download={result.name} />}>
            <Download className="size-4" aria-hidden="true" />
            Télécharger {result.name.split('.').pop()?.toUpperCase()} ({formatBytes(result.size)})
          </Button>
          <Button size="lg" variant="outline" className="h-12" onClick={convert}>
            <RotateCcw className="size-4" aria-hidden="true" />
            Reconvertir
          </Button>
        </div>
      ) : (
        <Button size="lg" className="h-12 text-base" disabled={!file || busy} onClick={convert}>
          {busy && <Loader2 className="size-4 animate-spin" aria-hidden="true" />}
          {busy ? 'Conversion…' : `Convertir en ${format.label}`}
        </Button>
      )}

      <p className="text-center text-xs text-muted-foreground">
        Vos fichiers ne quittent jamais votre appareil : tout est traité localement dans le navigateur.
      </p>
    </div>
  )
}
