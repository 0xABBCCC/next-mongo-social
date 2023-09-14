import handleSubmit from '@/hooks/createPost';
import handleDelete from '@/hooks/deletePost';
import timeAgo from '@/hooks/timeAgo';
import { useState, useEffect } from 'react';

export default function Home() {
    const [posts, setPosts] = useState([]);
    const [newPost, setNewPost] = useState({
      image: null,
      caption: '',
      username: '',
    });

    const [loading, setLoading] = useState(true);

    useEffect(() => {
      const fetchPosts = async () => {
        setLoading(true);
        const res = await fetch('/api/posts');
        const data = await res.json();
        setPosts(data);
        setLoading(false);
      };
      fetchPosts();
    }, []);

    const handleFileChange = (e) => {
      setNewPost({ ...newPost, image: e.target.files[0] });
    };

    const isImageAttached = newPost.image !== null && newPost.image !== undefined;

    function renderImagePreview() {
      try {
        return (
          <div className='create-post-image-container'>
            <img src={URL.createObjectURL(newPost.image)} alt="Attached" />
          </div>
        );
      } catch (error) {
        console.error("Failed to create object URL", error);
        return null;
      }
    }
  
    return (
      <div className='page-wrapper'>
        <div className='create-post-wrapper'>
          <h1 className='create-post-toggle'>Hover to create post</h1>
          <div className='create-post-container'>
            <h1 className='create-post-header'>Create Post</h1>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              style={{ display: "none" }}
              id="fileInput"
            />
            <label htmlFor="fileInput">
              {isImageAttached ? (
                renderImagePreview()
              ) : (
                <div className='create-post-image-container'>
                  <div>
                    <h1 style={{color: "var(--zinc-600)"}}>ATTACH IMAGE</h1>
                    <h1 style={{color: "var(--zinc-600)", fontSize: "12px", textAlign: "center"}}>Less than 1mb*</h1>
                  </div>
                </div>
              )}
            </label>
            <div className='create-post-divider'>
              <small>Caption</small>
              <div className='create-post-input-container'>
                <input
                  type="text"
                  placeholder="Caption"
                  value={newPost.caption}
                  onChange={(e) => setNewPost({ ...newPost, caption: e.target.value })}
                  className='create-post-input'
                />
              </div>
            </div>
            <div className='create-post-divider'>
              <small>Nickname</small>
              <div className='create-post-input-container'>
                <input
                  type="text"
                  placeholder="Username"
                  value={newPost.username}
                  onChange={(e) => setNewPost({ ...newPost, username: e.target.value })}
                  className='create-post-input'
                />
              </div>
            </div>
          </div>
          <div className='create-post-btn-wrapper'>
            <button onClick={() => handleSubmit({ newPost, setNewPost, posts, setPosts })} className='create-post-btn'>Post</button>
          </div>
        </div>

        {
          loading ? (
            <>
              { Array.from({ length: 16 }, (_, index) => (
                <div className='skeleton-item' key={index}>
                  <div className='skeleton-item-image'></div>
                  <h1 className='skeleton-item-caption'>loading...</h1>
                  <div className='item-info-wrapper'>
                    <small className='skeleton-item-caption'>from</small>
                    <small className='skeleton-item-caption'>timestamp</small>
                  </div>
                </div>
              ))}
            </>
          ) : (
            <>
              { posts.map((post, index) => (
                <div key={index} className='item'>
                  <div className='item-image'>
                    <img src={`data:image/png;base64,${post.image}`} alt={post.caption} />
                  </div>
                  <h1 className='item-caption'>{post.caption}</h1>
                  <div className='item-info-wrapper'>
                    <small className='item-info-text'>from: {post.username}</small>
                    <small className='item-info-text'>{timeAgo(post.createdAt)}</small>
                  </div>
                  <button onClick={() => handleDelete({ id: post._id, setPosts, posts })} className='item-del-btn'>Delete</button>
                </div>
              ))}
            </>
          )
        }
      </div>
    )
}
