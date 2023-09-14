export default async function handleDelete({ id, setPosts, posts }) {
    const res = await fetch('/api/posts', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id }),
    });
  
    if (res.status === 200) {
        setPosts(posts.filter((post) => post._id !== id));
    }
}