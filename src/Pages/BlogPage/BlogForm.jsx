import axios from "axios";
import { useEffect, useState } from "react";
import { FaPlus, FaEdit, FaTrash } from "react-icons/fa";

function BlogForm() {
    const [blogs, setBlogs] = useState([]);
    const [editingBlogId, setEditingBlogId] = useState(null);

    const [form, setForm] = useState({
        title: "",
        description: "",
        category: "",
        recipes: [],
    });

    const [files, setFiles] = useState({
        blogImage: null,
        blogBanner: null,
        recipeImages: {},
    });

    // Recipe form state
    const [recipeForm, setRecipeForm] = useState({
        recipeName: "",
        serving: 1,
        prep_time: 0,
        cook_time: 0,
        description: "",
        difficulty: "Easy",
        ingredients: [""],
        cooking_instructions: [""],
    });
    const [recipeImage, setRecipeImage] = useState(null);
    const [editingRecipeIndex, setEditingRecipeIndex] = useState(null);

    // Validation
    const [errors, setErrors] = useState({});
    const [submitted, setSubmitted] = useState(false);

    // Loading
    const [formSubmitting, setFormSubmitting] = useState(false);

    useEffect(() => {
        fetchBlogs();
    }, []);

    const fetchBlogs = async () => {
        try {
            const res = await axios.get("http://localhost:8000/api/blogs");
            setBlogs(res.data);
        } catch (err) {
            console.error("Error fetching blogs", err);
        }
    };

    // ✅ Validation
    const validate = () => {
        const err = {};
        if (!form.title.trim()) err.title = "Title is required";
        if (!form.description.trim()) err.description = "Description is required";
        if (!form.category.trim()) err.category = "Category is required";
        return err;
    };

    // ✅ Handle Blog Field Change
    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
        if (errors[name]) setErrors((prev) => ({ ...prev, [name]: null }));
    };

    // ✅ Handle Blog File Change
    const handleFile = (e, key) => {
        const file = e.target.files[0];
        setFiles((prev) => ({ ...prev, [key]: file }));
        if (errors[key]) setErrors((prev) => ({ ...prev, [key]: null }));
    };

    // ✅ Recipe form handlers
    const handleRecipeField = (field, value) => {
        setRecipeForm((prev) => ({ ...prev, [field]: value }));
    };

    const handleRecipeArray = (field, idx, value) => {
        const updated = [...recipeForm[field]];
        updated[idx] = value;
        setRecipeForm((prev) => ({ ...prev, [field]: updated }));
    };

    const addRecipeArrayItem = (field) => {
        setRecipeForm((prev) => ({ ...prev, [field]: [...prev[field], ""] }));
    };

    const removeRecipeArrayItem = (field, idx) => {
        const updated = [...recipeForm[field]];
        updated.splice(idx, 1);
        setRecipeForm((prev) => ({ ...prev, [field]: updated }));
    };

    const saveRecipe = () => {
        let updatedRecipes = [...form.recipes];
        if (editingRecipeIndex !== null) {
            updatedRecipes[editingRecipeIndex] = { ...recipeForm };
        } else {
            updatedRecipes.push({ ...recipeForm });
        }

        setForm((prev) => ({ ...prev, recipes: updatedRecipes }));
        setFiles((prev) => ({
            ...prev,
            recipeImages: {
                ...prev.recipeImages,
                [editingRecipeIndex !== null
                    ? editingRecipeIndex
                    : updatedRecipes.length - 1]: recipeImage,
            },
        }));

        // Reset recipe form
        setRecipeForm({
            recipeName: "",
            serving: 1,
            prep_time: 0,
            cook_time: 0,
            description: "",
            difficulty: "Easy",
            ingredients: [""],
            cooking_instructions: [""],
        });
        setRecipeImage(null);
        setEditingRecipeIndex(null);
    };

    const editRecipe = (index) => {
        setRecipeForm(form.recipes[index]);
        setRecipeImage(files.recipeImages[index] || null);
        setEditingRecipeIndex(index);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const removeRecipe = (index) => {
        if (!window.confirm("Delete this recipe?")) return;
        const updated = [...form.recipes];
        updated.splice(index, 1);
        setForm((prev) => ({ ...prev, recipes: updated }));

        const updatedImages = { ...files.recipeImages };
        delete updatedImages[index];
        setFiles((prev) => ({ ...prev, recipeImages: updatedImages }));
    };

    // ✅ Submit
    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitted(true);

        const err = validate();
        setErrors(err);
        if (Object.keys(err).length > 0) return;

        setFormSubmitting(true);
        try {
            const data = new FormData();
            data.append("title", form.title);
            data.append("description", form.description);
            data.append("category", form.category);
            data.append("recipes", JSON.stringify(form.recipes));

            if (files.blogImage) data.append("blogImage", files.blogImage);
            if (files.blogBanner) data.append("blogBanner", files.blogBanner);

            form.recipes.forEach((_, i) => {
                if (files.recipeImages[i]) {
                    data.append(`recipeImage_${i}`, files.recipeImages[i]);
                }
            });

            if (editingBlogId) {
                await axios.put(`http://localhost:8000/api/blogs/${editingBlogId}`, data, {
                    headers: { "Content-Type": "multipart/form-data" },
                });
                alert("✅ Blog Updated!");
            } else {
                await axios.post("http://localhost:8000/api/blogs/add", data, {
                    headers: { "Content-Type": "multipart/form-data" },
                });
                alert("✅ Blog Created!");
            }

            setForm({ title: "", description: "", category: "", recipes: [] });
            setFiles({ blogImage: null, blogBanner: null, recipeImages: {} });
            setEditingBlogId(null);
            setErrors({});
            setSubmitted(false);
            fetchBlogs();
        } catch (err) {
            console.error(err);
            alert("❌ Error saving blog");
        } finally {
            setFormSubmitting(false);
        }
    };

    const editBlog = (b) => {
        setForm(b);
        setEditingBlogId(b._id);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const deleteBlog = async (id) => {
        if (!window.confirm("Delete this blog?")) return;
        await axios.delete(`http://localhost:8000/api/blogs/${id}`);
        fetchBlogs();
    };

    return (
        <div className="px-2">
            <h2>{editingBlogId ? "Edit Blog" : "Add New Blog"}</h2>
            <form onSubmit={handleSubmit} noValidate>
                {/* Blog Section */}
                <div className="rounded-3 shadow overflow-hidden mb-4">
                    <div className="p-3 bg-white border-bottom">
                        <h6 className="fw-bold m-0 text-dark">
                            <FaPlus className="me-2" /> Blog Details
                        </h6>
                    </div>
                    <div className="px-4 pb-4 pt-2 bg-white">
                        <div className="row">
                            <div className="col-6">
                                <label className="fw-bold">Title</label>
                                <input
                                    type="text"
                                    name="title"
                                    value={form.title}
                                    onChange={handleChange}
                                    className={`form-control ${submitted && errors.title ? "border-danger" : "border-secondary"
                                        }`}
                                />
                                {submitted && errors.title && (
                                    <small className="text-danger">{errors.title}</small>
                                )}
                            </div>
                            <div className="col-6">
                                <label className="fw-bold">Category</label>
                                <input
                                    type="text"
                                    name="category"
                                    value={form.category}
                                    onChange={handleChange}
                                    className={`form-control ${submitted && errors.category ? "border-danger" : "border-secondary"
                                        }`}
                                />
                                {submitted && errors.category && (
                                    <small className="text-danger">{errors.category}</small>
                                )}
                            </div>
                            <div className="col-12 mt-3">
                                <label className="fw-bold">Description</label>
                                <textarea
                                    name="description"
                                    value={form.description}
                                    onChange={handleChange}
                                    className={`form-control ${submitted && errors.description
                                        ? "border-danger"
                                        : "border-secondary"
                                        }`}
                                />
                                {submitted && errors.description && (
                                    <small className="text-danger">{errors.description}</small>
                                )}
                            </div>

                            <div className="col-6 mt-3">
                                <label className="fw-bold">Blog Image</label>
                                <input
                                    type="file"
                                    className="form-control"
                                    onChange={(e) => handleFile(e, "blogImage")}
                                />
                                {files.blogImage && (
                                    <img
                                        src={URL.createObjectURL(files.blogImage)}
                                        alt="preview"
                                        width="80"
                                    />
                                )}
                            </div>
                            <div className="col-6 mt-3">
                                <label className="fw-bold">Blog Banner</label>
                                <input
                                    type="file"
                                    className="form-control"
                                    onChange={(e) => handleFile(e, "blogBanner")}
                                />
                                {files.blogBanner && (
                                    <img
                                        src={URL.createObjectURL(files.blogBanner)}
                                        alt="preview"
                                        width="80"
                                    />
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Recipes Section */}
                <div className="rounded-3 shadow overflow-hidden mb-4">
                    <div className="p-3 bg-white border-bottom">
                        <h6 className="fw-bold m-0 text-dark">
                            <FaPlus className="me-2" /> Recipes
                        </h6>
                    </div>
                    <div className="px-4 pb-4 pt-2 bg-white">
                        {/* Recipe Form */}
                        <div className="border p-3 mb-3 rounded bg-light">
                            <h5>
                                {editingRecipeIndex !== null ? "Edit Recipe" : "Add Recipe"}
                            </h5>
                            <input
                                type="text"
                                placeholder="Recipe Name"
                                value={recipeForm.recipeName}
                                onChange={(e) => handleRecipeField("recipeName", e.target.value)}
                                className="form-control my-1"
                            />

                            <div className="row mt-2">
                                <div className="col-3">
                                    <input
                                        type="number"
                                        placeholder="Serving"
                                        value={recipeForm.serving}
                                        onChange={(e) => handleRecipeField("serving", e.target.value)}
                                        className="form-control"
                                    />
                                </div>
                                <div className="col-3">
                                    <input
                                        type="number"
                                        placeholder="Prep Time (min)"
                                        value={recipeForm.prep_time}
                                        onChange={(e) => handleRecipeField("prep_time", e.target.value)}
                                        className="form-control"
                                    />
                                </div>
                                <div className="col-3">
                                    <input
                                        type="number"
                                        placeholder="Cook Time (min)"
                                        value={recipeForm.cook_time}
                                        onChange={(e) => handleRecipeField("cook_time", e.target.value)}
                                        className="form-control"
                                    />
                                </div>
                                <div className="col-3">
                                    <select
                                        value={recipeForm.difficulty}
                                        onChange={(e) =>
                                            handleRecipeField("difficulty", e.target.value)
                                        }
                                        className="form-control"
                                    >
                                        <option>Easy</option>
                                        <option>Medium</option>
                                        <option>Hard</option>
                                    </select>
                                </div>
                            </div>

                            <textarea
                                placeholder="Description"
                                value={recipeForm.description}
                                onChange={(e) =>
                                    handleRecipeField("description", e.target.value)
                                }
                                className="form-control my-2"
                            />

                            <label className="fw-bold mt-2">Ingredients</label>
                            {recipeForm.ingredients.map((ing, idx) => (
                                <div key={idx} className="d-flex my-1">
                                    <input
                                        type="text"
                                        value={ing}
                                        onChange={(e) =>
                                            handleRecipeArray("ingredients", idx, e.target.value)
                                        }
                                        className="form-control"
                                    />
                                    <button
                                        type="button"
                                        className="btn btn-danger btn-sm ms-2"
                                        onClick={() => removeRecipeArrayItem("ingredients", idx)}
                                    >
                                        X
                                    </button>
                                </div>
                            ))}
                            <button
                                type="button"
                                className="btn btn-sm btn-secondary"
                                onClick={() => addRecipeArrayItem("ingredients")}
                            >
                                + Add Ingredient
                            </button>

                            <label className="fw-bold mt-3">Cooking Instructions</label>
                            {recipeForm.cooking_instructions.map((step, idx) => (
                                <div key={idx} className="d-flex my-1">
                                    <input
                                        type="text"
                                        value={step}
                                        onChange={(e) =>
                                            handleRecipeArray("cooking_instructions", idx, e.target.value)
                                        }
                                        className="form-control"
                                    />
                                    <button
                                        type="button"
                                        className="btn btn-danger btn-sm ms-2"
                                        onClick={() =>
                                            removeRecipeArrayItem("cooking_instructions", idx)
                                        }
                                    >
                                        X
                                    </button>
                                </div>
                            ))}
                            <button
                                type="button"
                                className="btn btn-sm btn-secondary"
                                onClick={() => addRecipeArrayItem("cooking_instructions")}
                            >
                                + Add Step
                            </button>

                            <label className="fw-bold mt-2">Recipe Image</label>
                            <input
                                type="file"
                                className="form-control"
                                onChange={(e) => setRecipeImage(e.target.files[0])}
                            />
                            {recipeImage && (
                                <img
                                    src={URL.createObjectURL(recipeImage)}
                                    alt="recipe"
                                    width="80"
                                />
                            )}

                            <button
                                type="button"
                                className="btn btn-success mt-3"
                                onClick={saveRecipe}
                            >
                                {editingRecipeIndex !== null ? "Update Recipe" : "Add Recipe"}
                            </button>
                        </div>

                        {/* Recipe Table */}
                        {form.recipes.length > 0 && (
                            <table className="table table-bordered table-striped mb-4 text-center">
                                <thead>
                                    <tr>
                                        <th>Image</th>
                                        <th>Name</th>
                                        <th>Serving</th>
                                        <th>Prep</th>
                                        <th>Cook</th>
                                        <th>Difficulty</th>
                                        <th>Steps</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {form.recipes.map((r, i) => (
                                        <tr key={i}>
                                            <td>
                                                {files.recipeImages[i] ? (
                                                    <img
                                                        src={URL.createObjectURL(files.recipeImages[i])}
                                                        alt="recipe"
                                                        width="60"
                                                    />
                                                ) : (
                                                    <small>No Image</small>
                                                )}
                                            </td>
                                            <td>{r.recipeName}</td>
                                            <td>{r.serving}</td>
                                            <td>{r.prep_time}</td>
                                            <td>{r.cook_time}</td>
                                            <td>{r.difficulty}</td>
                                            <td>
                                                {r.cooking_instructions.map((step, idx) => (
                                                    <div key={idx}>{step}</div>
                                                ))}
                                            </td>
                                            <td>
                                                <FaEdit
                                                    className="text-warning fs-5"
                                                    style={{ cursor: "pointer" }}
                                                    onClick={() => editRecipe(i)}
                                                />
                                                <FaTrash
                                                    className="text-danger fs-5 ms-2"
                                                    style={{ cursor: "pointer" }}
                                                    onClick={() => removeRecipe(i)}
                                                />
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                </div>

                <div className="text-center">
                    <button type="submit" className="btn btn-primary" disabled={formSubmitting}>
                        {formSubmitting
                            ? "Saving..."
                            : editingBlogId
                                ? "Save Changes"
                                : "Save Blog"}
                    </button>
                </div>
            </form>

            {/* Loader Overlay */}
            {formSubmitting && (
                <div className="position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center bg-white bg-opacity-75">
                    <div className="spinner-border text-danger" role="status"></div>
                </div>
            )}

            {/* Blogs Table */}
            <h3 className="mt-5">📚 All Blogs</h3>
            <table className="table table-hover">
                <thead>
                    <tr>
                        <th>Image</th>
                        <th>Title</th>
                        <th>Category</th>
                        <th>Recipes</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {blogs.map((b) => (
                        <tr key={b._id}>
                            <td>{b.blogImage && <img src={b.blogImage} alt="" width="60" />}</td>
                            <td>{b.title}</td>
                            <td>{b.category}</td>
                            <td>{b.recipes.length}</td>
                            <td>
                                <FaEdit className="text-warning fs-5 me-2" onClick={() => editBlog(b)} />
                                <FaTrash
                                    className="text-danger fs-5"
                                    onClick={() => deleteBlog(b._id)}
                                />
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default BlogForm;
