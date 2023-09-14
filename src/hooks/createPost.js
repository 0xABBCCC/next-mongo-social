export default async function handleSubmit({ newPost, setNewPost, posts, setPosts }) {
    if (!newPost.image || !newPost.caption || !newPost.username) {
      alert('All fields are required!');
      return;
    }
  
    const reader = new FileReader();
    reader.readAsDataURL(newPost.image);
    reader.onloadend = async () => {
        const base64Image = reader.result.split(',')[1];
  
        const payload = {
          image: base64Image,
          caption: newPost.caption,
          username: newPost.username,
        };
  
        const res = await fetch('/api/posts', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        });
  
        if (res.status === 201) {
          const createdAt = new Date().toISOString();
          setPosts([...posts, { ...payload, createdAt }]);
          setNewPost({ image: null, caption: '', username: '' });
      }
    };
}
  