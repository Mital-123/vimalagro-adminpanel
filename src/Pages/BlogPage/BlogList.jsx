import React, { useEffect, useState } from "react";
import BlogForm from "./BlogForm";
import axios from "axios";

function BlogList() {
    const [blogs, setBlogs] = useState([]);
    const [editing, setEditing] = useState(null);

    const fetchBlogs = async () => {
        const res = await axios.get("http://localhost:8000/api/blogs");
        setBlogs(res.data);
    };

    useEffect(() => {
        fetchBlogs();
    }, []);

    const handleDelete = async (id) => {
        if (window.confirm("Delete this blog?")) {
            await axios.delete(`http://localhost:8000/api/blogs/${id}`);
            fetchBlogs();
        }
    };

    return (
        <div className="container mt-4">
            <h2>Blog Management</h2>
            <BlogForm
                blog={editing}
                onSuccess={() => {
                    setEditing(null);
                    fetchBlogs();
                }}
            />

            <table className="table mt-4">
                <thead>
                    <tr>
                        <th>Title</th>
                        <th>Category</th>
                        <th>Recipes</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {blogs.map((b) => (
                        <tr key={b._id}>
                            <td>{b.title}</td>
                            <td>{b.category}</td>
                            <td>{b.recipes.length}</td>
                            <td>
                                <button
                                    className="btn btn-sm btn-warning me-2"
                                    onClick={() => setEditing(b)}
                                >
                                    Edit
                                </button>
                                <button
                                    className="btn btn-sm btn-danger"
                                    onClick={() => handleDelete(b._id)}
                                >
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default BlogList;
