import axios from "axios";
import { useEffect, useState } from "react";
import { FaPlus } from "react-icons/fa";

function MainProducts() {

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

    const [sub, setSub] = useState({
        subproductName: "",
        subproductImg: "",
        description: "",
        weight: "",
    });

    const [recipe, setRecipe] = useState({
        recipeName: "",
        steps: [""],
        recipeMainImg: "",
        recipeSubImg: "",
    });

    const [products, setProducts] = useState([]);

    useEffect(() => {
        axios
            .get("https://backendvimalagro.onrender.com/api/products")
            .then((res) => setProducts(res.data))
            .catch((err) => console.error(err));
    }, []);

    const handleProductChange = (e) => {
        setProduct({ ...product, [e.target.name]: e.target.value });
    };
    const handleSubChange = (e) => {
        setSub({ ...sub, [e.target.name]: e.target.value });
    };
    const handleRecipeChange = (e) => {
        setRecipe({ ...recipe, [e.target.name]: e.target.value });
    };
    const handleStepChange = (index, value) => {
        const updatedSteps = [...recipe.steps];
        updatedSteps[index] = value;
        setRecipe({ ...recipe, steps: updatedSteps });
    };

    const uploadImageToCloudinary = async (file, folderName) => {
        const formData = new FormData();
        formData.append("image", file);
        formData.append("folder", folderName);
        const res = await axios.post(
            "https://backendvimalagro.onrender.com/api/upload/product-image",
            formData,
            { headers: { "Content-Type": "multipart/form-data" } }
        );
        return res.data.url;
    };

    const addSubproduct = async () => {
        if (!sub.subproductName) return alert("Subproduct name is required");
        let imgUrl = sub.subproductImg;
        const fileInput = document.getElementById("subImage");
        if (fileInput?.files[0]) {
            imgUrl = await uploadImageToCloudinary(
                fileInput.files[0],
                product.productName || "product"
            );
        }
        const updatedSub = { ...sub, subproductImg: imgUrl };
        setProduct({ ...product, subproducts: [...product.subproducts, updatedSub] });
        setSub({ subproductName: "", subproductImg: "", description: "", weight: "" });
    };

    const addRecipe = async () => {
        if (!recipe.recipeName) return alert("Recipe name is required");
        let mainImg = recipe.recipeMainImg;
        let subImg = recipe.recipeSubImg;
        const mainFile = document.getElementById("recipeMainImg");
        const subFile = document.getElementById("recipeSubImg");
        if (mainFile?.files[0]) {
            mainImg = await uploadImageToCloudinary(mainFile.files[0], "recipes");
        }
        if (subFile?.files[0]) {
            subImg = await uploadImageToCloudinary(subFile.files[0], "recipes");
        }
        const updatedRecipe = { ...recipe, recipeMainImg: mainImg, recipeSubImg: subImg };
        setProduct({ ...product, recipes: [...product.recipes, updatedRecipe] });
        setRecipe({ recipeName: "", steps: [""], recipeMainImg: "", recipeSubImg: "" });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const bannerFile = document.getElementById("productBanner");
            const banner2File = document.getElementById("banner2");
            const howToFile = document.getElementById("howToMakeBanner");
            const productImagesFile = document.getElementById("productImages");

            let productBanner = product.productBanner;
            let banner2 = product.banner2;
            let howToMakeBanner = product.howToMakeBanner;
            let productImages = product.productImages;

            if (bannerFile?.files[0]) {
                productBanner = await uploadImageToCloudinary(bannerFile.files[0], "products");
            }
            if (banner2File?.files[0]) {
                banner2 = await uploadImageToCloudinary(banner2File.files[0], "products");
            }
            if (howToFile?.files[0]) {
                howToMakeBanner = await uploadImageToCloudinary(howToFile.files[0], "products");
            }
            if (productImagesFile?.files.length) {
                const uploads = await Promise.all(
                    Array.from(productImagesFile.files).map((file) =>
                        uploadImageToCloudinary(file, "products")
                    )
                );
                productImages = uploads;
            }

            const payload = { ...product, productBanner, banner2, howToMakeBanner, productImages };

            await axios.post("https://backendvimalagro.onrender.com/api/products/add", payload);

            alert("✅ Product added!");
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
        } catch (err) {
            console.error(err);
            alert("Error saving product");
        }
    };

    return (
        <>
            <div className="container mt-3">
                <form onSubmit={handleSubmit}>
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
                            <div className="d-lg-flex d-md-flex gap-3">
                                <div className="w-100 w-lg-50 w-md-50 mt-2">
                                    <label className="d-block fw-bold">Product Name</label>
                                    <input
                                        type="text"
                                        name="productName"
                                        value={product.productName} onChange={handleProductChange}
                                        className="mt-1 w-100 form-control border border-secondary"
                                        placeholder="Enter Product Name"
                                    />
                                </div>
                                <div className="w-100 w-lg-50 w-md-50 mt-2">
                                    <label className="d-block fw-bold">Product Size</label>
                                    <input
                                        type="text"
                                        name=""
                                        value={product.productSizes}
                                        onChange={(e) => setProduct({ ...product, productSizes: e.target.value.split(",") })}
                                        className="mt-1 w-100 form-control border border-secondary"
                                        placeholder="Eg. Small, Medium, Large"
                                    />
                                </div>
                            </div>
                            <div className="d-lg-flex d-md-flex gap-3">
                                <div className="w-100 w-lg-50 w-md-50 mt-2">
                                    <label className="d-block fw-bold">Product Banner</label>
                                    <input
                                        type="file"
                                        name=""
                                        id="productBanner"
                                        className="mt-1 w-100 form-control border border-secondary"
                                    />
                                </div>
                                <div className="w-100 w-lg-50 w-md-50 mt-2">
                                    <label className="d-block fw-bold">Banner 2</label>
                                    <input
                                        type="file"
                                        name=""
                                        id="banner2"
                                        className="mt-1 w-100 form-control border border-secondary"
                                    />
                                </div>
                                <div className="w-100 w-lg-50 w-md-50 mt-2">
                                    <label className="d-block fw-bold">How To Make Banner</label>
                                    <input
                                        type="file"
                                        name=""
                                        id="howToMakeBanner"
                                        className="mt-1 w-100 form-control border border-secondary"
                                    />
                                </div>
                            </div>
                            <div className="w-100 w-lg-50 w-md-50 mt-2">
                                <label className="d-block fw-bold">Product Images (Multiple)</label>
                                <input
                                    type="file"
                                    name=""
                                    id="productImages"
                                    multiple
                                    className="mt-1 w-100 form-control border border-secondary"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="rounded-3 shadow overflow-hidden mt-4">
                        <div
                            className="p-3"
                            style={{ background: "white", borderBottom: "2px solid lightgrey" }}
                        >
                            <h6 className="fw-bold m-0 text-dark">
                                <FaPlus className="me-2" />
                                Add SubProduct
                            </h6>
                        </div>
                        <div className="px-4 pb-4 pt-2 bg-white">
                            <div className="d-lg-flex d-md-flex gap-3">
                                <div className="w-100 w-lg-50 w-md-50 mt-2">
                                    <label className="d-block fw-bold">SubProduct Name</label>
                                    <input
                                        type="text"
                                        name="subproductName"
                                        value={sub.subproductName} onChange={handleSubChange}
                                        className="mt-1 w-100 form-control border border-secondary"
                                        placeholder="Enter SubProduct Name"
                                    />
                                </div>
                                <div className="w-100 w-lg-50 w-md-50 mt-2">
                                    <label className="d-block fw-bold">SubProduct Weight</label>
                                    <input
                                        type="text"
                                        name="weight"
                                        value={sub.weight} onChange={handleSubChange}
                                        className="mt-1 w-100 form-control border border-secondary"
                                        placeholder="Enter SubProduct Weight"
                                    />
                                </div>
                                <div className="w-100 w-lg-50 w-md-50 mt-2">
                                    <label className="d-block fw-bold">SubProduct Image</label>
                                    <input
                                        type="file"
                                        name="subImage"
                                        className="mt-1 w-100 form-control border border-secondary"
                                    />
                                </div>
                            </div>
                            <div className="w-100 w-lg-50 w-md-50 mt-2">
                                <label className="d-block fw-bold">Description</label>
                                <textarea
                                    name="description"
                                    value={sub.description} onChange={handleSubChange}
                                    className="mt-1 w-100 form-control border border-secondary"
                                    placeholder="Enter Description"
                                ></textarea>
                            </div>
                            <div className="mt-3 text-center">
                                <button
                                    type="button"
                                    className="px-4 py-1 fw-bold text-uppercase rounded-3 adminbtn shadow"
                                    onClick={addSubproduct}
                                >
                                    <span><FaPlus className="me-1" /> Add SubProduct</span>
                                </button>
                            </div>
                        </div>
                    </div>

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
                            <div className="w-100 w-lg-50 w-md-50 mt-2">
                                <label className="d-block fw-bold">Recipe Name</label>
                                <input
                                    type="text"
                                    name="recipeName"
                                    value={recipe.recipeName} onChange={handleRecipeChange}
                                    className="mt-1 w-100 form-control border border-secondary"
                                    placeholder="Enter Recipe Name"
                                />
                            </div>
                            <div className="d-lg-flex d-md-flex gap-3">
                                <div className="w-100 w-lg-50 w-md-50 mt-2">
                                    <label className="d-block fw-bold">Recipe Main Image</label>
                                    <input
                                        type="file"
                                        name=""
                                        id="recipeMainImg"
                                        className="mt-1 w-100 form-control border border-secondary"
                                    />
                                </div>
                                <div className="w-100 w-lg-50 w-md-50 mt-2">
                                    <label className="d-block fw-bold">Recipe Sub Image</label>
                                    <input
                                        type="file"
                                        name=""
                                        id="recipeSubImg"
                                        className="mt-1 w-100 form-control border border-secondary"
                                    />
                                </div>
                            </div>
                            <div className="w-100 w-lg-50 w-md-50 mt-2">
                                <label className="d-block fw-bold">Recipe Steps</label>
                                {recipe.steps.map((step, i) => (
                                    <input
                                        type="text"
                                        name=""
                                        key={i}
                                        value={step} onChange={(e) => handleStepChange(i, e.target.value)}
                                        className="mt-1 w-100 form-control border border-secondary"
                                        placeholder={`Step ${i + 1}`}
                                    />
                                ))}
                            </div>
                            <div className="mt-3">
                                <button
                                    type="button"
                                    className="px-4 py-1 fw-bold text-uppercase rounded-3 adminbtn shadow"
                                    onClick={() => setRecipe({ ...recipe, steps: [...recipe.steps, ""] })}
                                >
                                    <span><FaPlus className="me-1" /> Add Step</span>
                                </button>
                            </div>
                            <div className="text-center">
                                <button
                                    type="button"
                                    className="px-4 py-1 fw-bold text-uppercase rounded-3 adminbtn shadow"
                                    onClick={addRecipe}
                                >
                                    <span><FaPlus className="me-1" /> Add Recipe</span>
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="mt-4 text-center">
                        <button
                            type="button"
                            className="px-4 py-1 fw-bold text-uppercase rounded-3 adminbtn shadow"
                            onClick={addRecipe}
                        >
                            <span>Submit</span>
                        </button>
                    </div>
                </form>
            </div>
        </>
    );
}

export default MainProducts