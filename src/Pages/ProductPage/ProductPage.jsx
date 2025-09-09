import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaEdit, FaPlus, FaTrash } from "react-icons/fa";

function ProductPage() {
    const [products, setProducts] = useState([]);
    const [editingProductId, setEditingProductId] = useState(null);

    const [product, setProduct] = useState({
        productBanner: "",
        productName: "",
        productImages: [],
        productSizes: [],
        subproducts: [],
        banner2: "",
        howToMakeBanner: "",
        recipes: [],
    });

    const [files, setFiles] = useState({
        productBanner: null,
        banner2: null,
        howToMakeBanner: null,
        productImages: [],
    });

    const [sub, setSub] = useState({
        subproductName: "",
        subproductImg: "",
        description: "",
        weight: "",
    });
    const [editingSubIndex, setEditingSubIndex] = useState(null);

    const [recipe, setRecipe] = useState({
        recipeName: "",
        steps: [],
        recipeMainImg: "",
        recipeSubImg: "",
    });
    const [editingRecipeIndex, setEditingRecipeIndex] = useState(null);

    // Validation error states
    const [productErrors, setProductErrors] = useState({});
    const [subErrors, setSubErrors] = useState({});
    const [recipeErrors, setRecipeErrors] = useState({});

    // Submitted flags to show errors only after submit attempt
    const [productSubmitted, setProductSubmitted] = useState(false);
    const [subSubmitted, setSubSubmitted] = useState(false);
    const [recipeSubmitted, setRecipeSubmitted] = useState(false);

    // Loading states
    const [loadingImages, setLoadingImages] = useState({
        productBanner: false,
        banner2: false,
        howToMakeBanner: false,
        productImages: false,
        subproductImg: false,
        recipeMainImg: false,
        recipeSubImg: false,
    });
    const [formSubmitting, setFormSubmitting] = useState(false);

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const res = await axios.get(
                "https://backendvimalagro.onrender.com/api/products"
            );
            setProducts(res.data);
        } catch (err) {
            console.error("Error fetching products", err);
        }
    };

    // Helper: validate product fields
    const validateProduct = () => {
        const errors = {};
        if (!product.productName.trim())
            errors.productName = "Product Name is required";
        if (!product.productBanner && !files.productBanner)
            errors.productBanner = "Product Banner is required";
        if (
            product.productSizes.length === 0 ||
            product.productSizes.every((s) => !s.trim())
        )
            errors.productSizes = "At least one product size is required";
        return errors;
    };

    // Helper: validate subproduct only if any field filled
    const validateSub = () => {
        const errors = {};
        const anyFieldFilled =
            sub.subproductName.trim() ||
            sub.subproductImg ||
            sub.description.trim() ||
            sub.weight;
        if (!anyFieldFilled) return errors; // no validation if empty

        if (!sub.subproductName.trim())
            errors.subproductName = "Subproduct Name is required";
        if (!sub.subproductImg) errors.subproductImg = "Subproduct Image is required";
        if (!sub.description.trim()) errors.description = "Description is required";
        if (!sub.weight) errors.weight = "Weight is required";
        return errors;
    };

    // Helper: validate recipe only if any field filled
    const validateRecipe = () => {
        const errors = {};
        const anyFieldFilled =
            recipe.recipeName.trim() ||
            recipe.recipeMainImg ||
            recipe.recipeSubImg ||
            recipe.steps.length > 0;
        if (!anyFieldFilled) return errors;

        if (!recipe.recipeName.trim())
            errors.recipeName = "Recipe Name is required";
        if (!recipe.recipeMainImg)
            errors.recipeMainImg = "Main Recipe Image is required";
        if (!recipe.recipeSubImg)
            errors.recipeSubImg = "Sub Recipe Image is required";
        if (
            recipe.steps.length === 0 ||
            recipe.steps.some((step) => !step.trim())
        )
            errors.steps = "All steps must be filled";
        return errors;
    };

    // Clear product error on input change
    const handleChange = (e) => {
        const { name, value } = e.target;
        setProduct((prev) => ({
            ...prev,
            [name]: name === "productSizes" ? value.split(",") : value,
        }));
        if (productErrors[name]) {
            setProductErrors((prev) => ({ ...prev, [name]: null }));
        }
    };

    // Clear subproduct error on input change
    const handleSubChange = (e) => {
        const { name, value } = e.target;
        setSub((prev) => ({ ...prev, [name]: value }));
        if (subErrors[name]) {
            setSubErrors((prev) => ({ ...prev, [name]: null }));
        }
    };

    // Clear recipe error on input change
    const handleRecipeChange = (e) => {
        const { name, value } = e.target;
        setRecipe((prev) => ({ ...prev, [name]: value }));
        if (recipeErrors[name]) {
            setRecipeErrors((prev) => ({ ...prev, [name]: null }));
        }
    };

    // Handle steps change with error clearing
    const handleStepChange = (index, value) => {
        const updatedSteps = [...recipe.steps];
        updatedSteps[index] = value;
        setRecipe((prev) => ({ ...prev, steps: updatedSteps }));
        if (recipeErrors.steps) {
            setRecipeErrors((prev) => ({ ...prev, steps: null }));
        }
    };

    // Handle file select with loader for product images
    const handleFileSelect = (e, key, multiple = false) => {
        if (multiple) {
            setFiles((prev) => ({ ...prev, [key]: [...prev[key], ...e.target.files] }));
        } else {
            setFiles((prev) => ({ ...prev, [key]: e.target.files[0] }));
        }
        // Clear error for that field
        if (productErrors[key]) {
            setProductErrors((prev) => ({ ...prev, [key]: null }));
        }
    };

    // Subproduct image upload with loader and error clearing
    const handleSubFileUpload = async (e) => {
        const file = e.target.files[0];
        if (file) {
            setSub((prev) => ({ ...prev, subproductImg: file }));
        }
    };

    // Recipe image upload with loader and error clearing
    const handleRecipeFileUpload = async (e, key) => {
        const file = e.target.files[0];
        if (file) {
            if (key === "recipeSubImg") {
                setRecipe((prev) => ({
                    ...prev,
                    recipeSubImg: [...(prev.recipeSubImg || []), file],
                }));
            } else {
                setRecipe((prev) => ({ ...prev, [key]: file }));
            }
        }
    };

    // Add or update subproduct with validation
    const addOrUpdateSubproduct = () => {
        setSubSubmitted(true);
        const errors = validateSub();
        setSubErrors(errors);
        if (Object.keys(errors).length > 0) return;

        setProduct((prev) => {
            const updatedSubs = [...prev.subproducts];
            if (editingSubIndex !== null) {
                updatedSubs[editingSubIndex] = { ...sub };
            } else {
                updatedSubs.push({ ...sub });
            }
            return { ...prev, subproducts: updatedSubs };
        });

        // reset form
        setSub({
            subproductName: "",
            subproductImg: "",
            description: "",
            weight: "",
        });
        setEditingSubIndex(null);
        setSubErrors({});
        setSubSubmitted(false);
    };

    // Add or update recipe with validation
    const addOrUpdateRecipe = () => {
        setRecipeSubmitted(true);
        const errors = validateRecipe();
        setRecipeErrors(errors);
        if (Object.keys(errors).length > 0) return;

        setProduct((prev) => {
            const updatedRecipes = [...prev.recipes];
            if (editingRecipeIndex !== null) {
                updatedRecipes[editingRecipeIndex] = { ...recipe };
            } else {
                updatedRecipes.push({ ...recipe });
            }
            return { ...prev, recipes: updatedRecipes };
        });

        // reset form
        setRecipe({
            recipeName: "",
            steps: [],
            recipeMainImg: "",
            recipeSubImg: "",
        });
        setEditingRecipeIndex(null);
        setRecipeErrors({});
        setRecipeSubmitted(false);
    };

    // Edit subproduct
    const editSubproduct = (index) => {
        setSub(product.subproducts[index]);
        setEditingSubIndex(index);
        setSubErrors({});
        setSubSubmitted(false);
        window.scrollTo({ top: 300, behavior: "smooth" });
    };

    // Remove subproduct
    const removeSubproduct = (index) => {
        const updated = [...product.subproducts];
        updated.splice(index, 1);
        setProduct({ ...product, subproducts: updated });
        if (editingSubIndex === index) {
            setSub({
                subproductName: "",
                subproductImg: "",
                description: "",
                weight: "",
            });
            setEditingSubIndex(null);
            setSubErrors({});
            setSubSubmitted(false);
        }
    };

    // Edit recipe
    const editRecipe = (index) => {
        setRecipe(product.recipes[index]);
        setEditingRecipeIndex(index);
        setRecipeErrors({});
        setRecipeSubmitted(false);
        window.scrollTo({ top: 500, behavior: "smooth" });
    };

    // Remove recipe
    const removeRecipe = (index) => {
        const updated = [...product.recipes];
        updated.splice(index, 1);
        setProduct({ ...product, recipes: updated });
        if (editingRecipeIndex === index) {
            setRecipe({
                recipeName: "",
                steps: [],
                recipeMainImg: "",
                recipeSubImg: "",
            });
            setEditingRecipeIndex(null);
            setRecipeErrors({});
            setRecipeSubmitted(false);
        }
    };

    // Submit product form with validation and loader
    const handleSubmit = async (e) => {
        e.preventDefault();
        setProductSubmitted(true);

        const errors = validateProduct();
        setProductErrors(errors);
        if (Object.keys(errors).length > 0) {
            window.scrollTo({ top: 0, behavior: "smooth" });
            return;
        }

        setFormSubmitting(true);

        try {
            const formData = new FormData();

            // ✅ text fields
            formData.append("productName", product.productName);
            formData.append("productSizes", JSON.stringify(product.productSizes));
            formData.append("subproducts", JSON.stringify(product.subproducts.map(s => ({
                subproductName: s.subproductName,
                description: s.description,
                weight: s.weight,
            }))));
            formData.append("recipes", JSON.stringify(product.recipes.map(r => ({
                recipeName: r.recipeName,
                steps: r.steps,
            }))));

            // ✅ files
            if (files.productBanner) formData.append("productBanner", files.productBanner);
            if (files.banner2) formData.append("banner2", files.banner2);
            if (files.howToMakeBanner) formData.append("howToMakeBanner", files.howToMakeBanner);

            if (files.productImages.length > 0) {
                files.productImages.forEach((file) => {
                    formData.append("productImages", file);
                });
            }
            product.subproducts.forEach((sub, index) => {
                if (sub.subproductImg instanceof File) {
                    formData.append(`subproductImg_${index}`, sub.subproductImg);
                }
            });
            // ✅ Recipes files
            product.recipes.forEach((rec, index) => {
                if (rec.recipeMainImg instanceof File) {
                    formData.append(`recipeMainImg_${index}`, rec.recipeMainImg); // ✅ indexed
                }
                if (Array.isArray(rec.recipeSubImg)) {
                    rec.recipeSubImg.forEach(file => {
                        if (file instanceof File) {
                            formData.append(`recipeSubImg_${index}`, file); // ✅ indexed
                        }
                    });
                }
            });


            // 🔥 send to backend
            if (editingProductId) {
                await axios.put(
                    `https://backendvimalagro.onrender.com/api/products/${editingProductId}`,
                    formData,
                    { headers: { "Content-Type": "multipart/form-data" } }
                );
                alert("✅ Product Updated!");
            } else {
                await axios.post("https://backendvimalagro.onrender.com/api/products/add", formData, {
                    headers: { "Content-Type": "multipart/form-data" },
                });
                alert("✅ Product Saved!");
            }

            // reset
            setProduct({
                productBanner: "",
                productName: "",
                productImages: [],
                productSizes: [],
                subproducts: [],
                banner2: "",
                howToMakeBanner: "",
                recipes: [],
            });
            setFiles({ productBanner: null, banner2: null, howToMakeBanner: null, productImages: [] });
            setEditingProductId(null);
            setProductErrors({});
            setProductSubmitted(false);
            fetchProducts();
        } catch (err) {
            console.error(err);
            alert("❌ Failed to save product");
        } finally {
            setFormSubmitting(false);
        }
    };

    // Edit product
    const editProduct = (p) => {
        setProduct(p);
        setEditingProductId(p._id);
        setEditingSubIndex(null);
        setEditingRecipeIndex(null);
        setProductErrors({});
        setProductSubmitted(false);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    // Delete product
    const deleteProduct = async (id) => {
        if (!window.confirm("Delete this product?")) return;
        try {
            await axios.delete(`https://backendvimalagro.onrender.com/api/products/${id}`);
            fetchProducts();
        } catch (err) {
            console.error("Delete failed", err);
        }
    };

    return (
        <div>
            <div className="px-2">
                <h2>{editingProductId ? "Edit Product" : "Add New Product"}</h2>
                <form onSubmit={handleSubmit} noValidate>
                    <div className="rounded-3 shadow overflow-hidden">
                        <div
                            className="p-3"
                            style={{ background: "white", borderBottom: "2px solid lightgrey" }}
                        >
                            <h6 className="fw-bold m-0 text-dark">
                                <FaPlus className="me-2" />
                                Add New Product
                            </h6>
                        </div>
                        <div className="px-4 pb-4 pt-2 bg-white">
                            <div className="row">
                                <div className="col-6">
                                    <label className="d-block fw-bold">Product Name</label>
                                    <input
                                        type="text"
                                        name="productName"
                                        value={product.productName}
                                        onChange={handleChange}
                                        className={`mt-1 w-100 form-control border ${productErrors.productName ? "border-danger" : "border-secondary"
                                            }`}
                                        disabled={formSubmitting}
                                    />
                                    {productSubmitted && productErrors.productName && (
                                        <small className="text-danger">{productErrors.productName}</small>
                                    )}
                                </div>
                                <div className="col-6">
                                    <label className="d-block fw-bold">Product Sizes (comma separated)</label>
                                    <input
                                        type="text"
                                        name="productSizes"
                                        value={product.productSizes.join(",")}
                                        onChange={handleChange}
                                        className={`mt-1 w-100 form-control border ${productErrors.productSizes ? "border-danger" : "border-secondary"
                                            }`}
                                        disabled={formSubmitting}
                                    />
                                    {productSubmitted && productErrors.productSizes && (
                                        <small className="text-danger">{productErrors.productSizes}</small>
                                    )}
                                </div>
                                <div className="col-6">
                                    <label className="d-block fw-bold">Product Banner</label>
                                    <input
                                        type="file"
                                        className={`mt-1 w-100 form-control border ${productErrors.productBanner ? "border-danger" : "border-secondary"
                                            }`}
                                        onChange={(e) => handleFileSelect(e, "productBanner")}
                                        disabled={formSubmitting || loadingImages.productBanner}
                                    />
                                    {loadingImages.productBanner && <div>Loading image...</div>}
                                    {(files.productBanner || product.productBanner) && !loadingImages.productBanner && (
                                        <img
                                            src={
                                                files.productBanner
                                                    ? URL.createObjectURL(files.productBanner)
                                                    : product.productBanner
                                            }
                                            alt="Product Banner"
                                            width="100"
                                            height={100}
                                        />
                                    )}
                                    {productSubmitted && productErrors.productBanner && (
                                        <small className="text-danger">{productErrors.productBanner}</small>
                                    )}
                                </div>
                                <div className="col-6">
                                    <label className="d-block fw-bold">Product Images</label>
                                    <input
                                        type="file"
                                        className="mt-1 w-100 form-control border border-secondary"
                                        multiple
                                        onChange={(e) => handleFileSelect(e, "productImages", true)}
                                        disabled={formSubmitting || loadingImages.productImages}
                                    />
                                    {loadingImages.productImages && <div>Loading images...</div>}
                                    <div className="mt-2">
                                        {[...product.productImages, ...files.productImages].map((img, i) => {
                                            const src = typeof img === "string" ? img : URL.createObjectURL(img);
                                            return (
                                                <img
                                                    key={i}
                                                    src={src}
                                                    alt={`Product Img ${i + 1}`}
                                                    width="80"
                                                    height={100}
                                                    className="me-2"
                                                />
                                            );
                                        })}
                                    </div>
                                </div>
                                <div className="col-6">
                                    <label className="d-block fw-bold">Banner 2</label>
                                    <input
                                        type="file"
                                        className="mt-1 w-100 form-control border border-secondary"
                                        onChange={(e) => handleFileSelect(e, "banner2")}
                                        disabled={formSubmitting || loadingImages.banner2}
                                    />
                                    {loadingImages.banner2 && <div>Loading image...</div>}
                                    {(files.banner2 || product.banner2) && !loadingImages.banner2 && (
                                        <img
                                            src={
                                                files.banner2 ? URL.createObjectURL(files.banner2) : product.banner2
                                            }
                                            alt="Banner 2"
                                            width="100"
                                            height={100}
                                        />
                                    )}
                                </div>
                                <div className="col-6">
                                    <label className="d-block fw-bold">How To Make Banner</label>
                                    <input
                                        type="file"
                                        className="mt-1 w-100 form-control border border-secondary"
                                        onChange={(e) => handleFileSelect(e, "howToMakeBanner")}
                                        disabled={formSubmitting || loadingImages.howToMakeBanner}
                                    />
                                    {loadingImages.howToMakeBanner && <div>Loading image...</div>}
                                    {(files.howToMakeBanner || product.howToMakeBanner) && !loadingImages.howToMakeBanner && (
                                        <img
                                            src={
                                                files.howToMakeBanner
                                                    ? URL.createObjectURL(files.howToMakeBanner)
                                                    : product.howToMakeBanner
                                            }
                                            alt="How To Make Banner"
                                            width="100"
                                            height={100}
                                        />
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Subproduct Section */}
                    <div className="rounded-3 shadow overflow-hidden mt-4">
                        <div
                            className="p-3"
                            style={{ background: "white", borderBottom: "2px solid lightgrey" }}
                        >
                            <h6 className="fw-bold m-0 text-dark">
                                <FaPlus className="me-2" /> Add SubProduct
                            </h6>
                        </div>
                        <div className="px-4 pb-4 pt-2 bg-white">
                            <div className="row gap-3">
                                <h4>📦 Add Subproduct</h4>
                                <div className="row">
                                    <div className="col-12 col-md-6">
                                        <label className="d-block fw-bold">Subproduct Name</label>
                                        <input
                                            type="text"
                                            name="subproductName"
                                            value={sub.subproductName}
                                            onChange={handleSubChange}
                                            className={`mt-1 w-100 form-control border ${subSubmitted && subErrors.subproductName ? "border-danger" : "border-secondary"
                                                }`}
                                            disabled={formSubmitting}
                                        />
                                        {subSubmitted && subErrors.subproductName && (
                                            <small className="text-danger">{subErrors.subproductName}</small>
                                        )}
                                    </div>
                                    <div className="col-12 col-md-6">
                                        <label className="d-block fw-bold">Subproduct Image</label>
                                        <input
                                            type="file"
                                            className="mt-1 w-100 form-control border border-secondary"
                                            onChange={handleSubFileUpload}
                                            disabled={formSubmitting || loadingImages.subproductImg}
                                        />
                                        {loadingImages.subproductImg && <div>Loading image...</div>}
                                        {sub.subproductImg && !loadingImages.subproductImg && (
                                            <img src={sub.subproductImg instanceof File ? URL.createObjectURL(sub.subproductImg) : sub.subproductImg} alt="Subproduct" width="80" height={100} />
                                        )}
                                        {subSubmitted && subErrors.subproductImg && (
                                            <small className="text-danger">{subErrors.subproductImg}</small>
                                        )}
                                    </div>
                                    <div className="col-12 col-md-6">
                                        <label className="d-block fw-bold">Description</label>
                                        <input
                                            type="text"
                                            name="description"
                                            value={sub.description}
                                            onChange={handleSubChange}
                                            className={`mt-1 w-100 form-control border ${subSubmitted && subErrors.description ? "border-danger" : "border-secondary"
                                                }`}
                                            disabled={formSubmitting}
                                        />
                                        {subSubmitted && subErrors.description && (
                                            <small className="text-danger">{subErrors.description}</small>
                                        )}
                                    </div>
                                    <div className="col-12 col-md-6">
                                        <label className="d-block fw-bold">Weight</label>
                                        <input
                                            type="number"
                                            name="weight"
                                            value={sub.weight}
                                            onChange={handleSubChange}
                                            className={`mt-1 w-100 form-control border ${subSubmitted && subErrors.weight ? "border-danger" : "border-secondary"
                                                }`}
                                            disabled={formSubmitting}
                                        />
                                        {subSubmitted && subErrors.weight && (
                                            <small className="text-danger">{subErrors.weight}</small>
                                        )}
                                    </div>
                                </div>
                                <div className="mt-3 text-center col-12">
                                    <button
                                        type="button"
                                        className="px-4 py-1 fw-bold text-uppercase rounded-3 adminbtn shadow"
                                        onClick={addOrUpdateSubproduct}
                                        disabled={formSubmitting}
                                    >
                                        <span>{editingSubIndex !== null ? "✏️ Update Subproduct" : "+ Add Subproduct"}</span>
                                    </button>
                                </div>

                                {product.subproducts.length > 0 && (
                                    <table className="table table-bordered table-striped mb-4 text-center">
                                        <thead>
                                            <tr>
                                                <th>Image</th>
                                                <th>Name</th>
                                                <th>Description</th>
                                                <th>Weight</th>
                                                <th>Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {product.subproducts.map((s, i) => (
                                                <tr key={i}>
                                                    <td>{s.subproductImg && <img src={s.subproductImg} alt="" width="50" />}</td>
                                                    <td>{s.subproductName}</td>
                                                    <td>{s.description}</td>
                                                    <td>{s.weight}</td>
                                                    <td>
                                                        <FaEdit
                                                            className="text-warning fs-5"
                                                            onClick={() => editSubproduct(i)}
                                                            disabled={formSubmitting}
                                                        />

                                                        <FaTrash
                                                            className="text-danger fs-5 ms-0 ms-md-2"
                                                            onClick={() => removeSubproduct(i)}
                                                            disabled={formSubmitting}
                                                        />

                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Recipe Section */}
                    <div className="rounded-3 shadow overflow-hidden mt-4">
                        <div
                            className="p-3"
                            style={{ background: "white", borderBottom: "2px solid lightgrey" }}
                        >
                            <h6 className="fw-bold m-0 text-dark">
                                <FaPlus className="me-2" />
                                Add Recipe
                            </h6>
                        </div>
                        <div className="px-4 pb-4 pt-2 bg-white">
                            <h4>🥘 Add Recipe</h4>
                            <div className="row">
                                <div className="col-12 col-md-6">
                                    <label className="d-block fw-bold">Recipe Name</label>
                                    <input
                                        type="text"
                                        name="recipeName"
                                        value={recipe.recipeName}
                                        onChange={handleRecipeChange}
                                        className={`mt-1 w-100 form-control border ${recipeSubmitted && recipeErrors.recipeName ? "border-danger" : "border-secondary"
                                            }`}
                                        disabled={formSubmitting}
                                    />
                                    {recipeSubmitted && recipeErrors.recipeName && (
                                        <small className="text-danger">{recipeErrors.recipeName}</small>
                                    )}
                                </div>
                                <div className="col-12 col-md-6">
                                    <label className="d-block fw-bold">Main Recipe Image</label>
                                    <input
                                        type="file"
                                        className="mt-1 w-100 form-control border border-secondary"
                                        onChange={(e) => handleRecipeFileUpload(e, "recipeMainImg")}
                                        disabled={formSubmitting || loadingImages.recipeMainImg}
                                    />
                                    {loadingImages.recipeMainImg && <div>Loading image...</div>}
                                    {/* {recipe.recipeMainImg && !loadingImages.recipeMainImg && (
                                        <img src={recipe.recipeMainImg} alt="" width="80" height={100} />
                                    )} */}

                                    {recipe.recipeMainImg && !loadingImages.recipeMainImg && (
                                        <img src={recipe.recipeMainImg instanceof File ? URL.createObjectURL(recipe.recipeMainImg) : sub.recipeMainImg} alt="Subproduct" width="80" height={100} />
                                    )}
                                    {recipeSubmitted && recipeErrors.recipeMainImg && (
                                        <small className="text-danger">{recipeErrors.recipeMainImg}</small>
                                    )}
                                </div>

                                <div className="col-12">
                                    <label className="d-block fw-bold">Sub Recipe Image</label>
                                    <input
                                        type="file"
                                        className="mt-1 w-100 form-control border border-secondary"
                                        onChange={(e) => handleRecipeFileUpload(e, "recipeSubImg")}
                                        disabled={formSubmitting || loadingImages.recipeSubImg}
                                    />
                                    {loadingImages.recipeSubImg && <div>Loading image...</div>}
                                    {/* {recipe.recipeSubImg && !loadingImages.recipeSubImg && (
                                        <img src={recipe.recipeSubImg} alt="" width="80" height={100} />
                                    )} */}

                                    {recipe.recipeSubImg && !loadingImages.recipeSubImg && (
                                        <img src={recipe.recipeSubImg instanceof File ? URL.createObjectURL(recipe.recipeSubImg) : sub.recipeSubImg} alt="Subproduct" width="80" height={100} />
                                    )}
                                    {recipeSubmitted && recipeErrors.recipeSubImg && (
                                        <small className="text-danger">{recipeErrors.recipeSubImg}</small>
                                    )}
                                </div>
                                <div className="col-12 ">
                                    <label className="d-block fw-bold">Steps</label>
                                    {recipe.steps.map((step, index) => (
                                        <div key={index} className="d-flex align-items-center mb-2">
                                            <input
                                                type="text"
                                                value={step}
                                                onChange={(e) => handleStepChange(index, e.target.value)}
                                                className="form-control me-2"
                                                placeholder={`Step ${index + 1}`}
                                                disabled={formSubmitting}
                                            />
                                            <button
                                                type="button"
                                                className="btn btn-sm btn-danger"
                                                onClick={() => {
                                                    const updatedSteps = recipe.steps.filter((_, i) => i !== index);
                                                    setRecipe((prev) => ({ ...prev, steps: updatedSteps }));
                                                    if (recipeErrors.steps) {
                                                        setRecipeErrors((prev) => ({ ...prev, steps: null }));
                                                    }
                                                }}
                                                disabled={formSubmitting}
                                            >
                                                ❌
                                            </button>
                                        </div>
                                    ))}

                                    {recipeSubmitted && recipeErrors.steps && (
                                        <small className="text-danger">{recipeErrors.steps}</small>
                                    )}

                                    <button
                                        type="button"
                                        className="btn btn-sm btn-outline-danger"
                                        onClick={() => setRecipe((prev) => ({ ...prev, steps: [...prev.steps, ""] }))}
                                        disabled={formSubmitting}
                                    >
                                        + Add Step
                                    </button>
                                </div>
                            </div>
                            <div className="mt-3 text-center">
                                <button
                                    type="button"
                                    className="px-4 py-1 fw-bold text-uppercase rounded-3 adminbtn shadow"
                                    onClick={addOrUpdateRecipe}
                                    disabled={formSubmitting}
                                >
                                    <span>{editingRecipeIndex !== null ? "✏️ Update Recipe" : "+ Add Recipe"}</span>
                                </button>
                            </div>
                        </div>
                    </div>

                    {product.recipes.length > 0 && (
                        <table className="table table-bordered table-striped mb-4 text-center">
                            <thead>
                                <tr>
                                    <th>Main Img</th>
                                    <th>Sub Img</th>
                                    <th>Name</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {product.recipes.map((r, i) => (
                                    <tr key={i}>
                                        <td>{r.recipeMainImg && <img src={r.recipeMainImg} alt="" width="50" />}</td>
                                        <td>{r.recipeSubImg && <img src={r.recipeSubImg} alt="" width="50" />}</td>
                                        <td>{r.recipeName}</td>
                                        <td>
                                            <FaEdit
                                                className="text-warning fs-5"
                                                onClick={() => editRecipe(i)}
                                                disabled={formSubmitting}
                                            />

                                            <FaTrash
                                                className="text-danger fs-5 ms-0 ms-md-2"
                                                onClick={() => removeRecipe(i)}
                                                disabled={formSubmitting}
                                            />

                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}

                    <div className="mt-3 text-center">
                        <button
                            type="submit"
                            className="px-4 py-1 fw-bold text-uppercase rounded-3 adminbtn shadow"
                            disabled={formSubmitting}
                        >
                            {formSubmitting ? "Saving..." : editingProductId ? "Save All Changes" : "Save Product"}
                        </button>
                    </div>
                </form>
                {/* Loader */}
                {formSubmitting && (
                    <div
                        style={{
                            position: "absolute",
                            top: 0,
                            left: 0,
                            width: "100%",
                            height: "100%",
                            backgroundColor: "rgba(255, 255, 255, 0.7)",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            zIndex: 1000,
                            pointerEvents: "auto",
                        }}
                    >
                        <img
                            src={require('../../assets/Images/vimal logo.png')} // put your loader image path here
                            alt="Loading..."
                            style={{ width: 80, height: 80 }}
                        />
                    </div>
                )}
                {/* Product Table */}
                <h3 className="mt-5">📦 All Products</h3>
                <table className="table table-hover">
                    <thead>
                        <tr>
                            <th>Banner</th>
                            <th>Name</th>
                            <th>Sizes</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.map((p) => (
                            <tr key={p._id}>
                                <td>{p.productBanner && <img src={p.productBanner} alt="" width="60" />}</td>
                                <td>{p.productName}</td>
                                <td>{p.productSizes?.join(", ")}</td>
                                <td>
                                    <FaEdit
                                        className="text-warning fs-5"
                                        onClick={() => editProduct(p)}
                                        disabled={formSubmitting}
                                    />

                                    <FaTrash
                                        className="text-danger fs-5 ms-0 ms-md-2"
                                        onClick={() => deleteProduct(p._id)}
                                        disabled={formSubmitting}
                                    />

                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default ProductPage;