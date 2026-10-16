async function test() {
    const res = await fetch("http://localhost:3000/api/youtube/download?url=https://www.youtube.com/watch?v=dQw4w9WgXcQ", { redirect: 'manual' });
    console.log(res.status, res.headers.get('location'));
}
test().catch(console.error);
