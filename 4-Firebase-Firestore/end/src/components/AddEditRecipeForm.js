import { useEffect, useState } from "react";

function AddEditRecipeForm({
  existingRecipe,
  handleAddRecipe,
  handleUpdateRecipe,
  handleDeleteRecipe,
  handleEditRecipeCancel,
  formatDate,
}) {
  useEffect(() => {
    if (existingRecipe) {
      setName(existingRecipe.name);
      setCategory(existingRecipe.category);
      setDirections(existingRecipe.directions);
      setPublishDate(formatDate(existingRecipe.publishDate, "YearMonthDay"));

      setIngredients(existingRecipe.ingredients);
    } else {
      resetForm();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [existingRecipe]);

  const [name, setName] = useState("");
  const [category, setCategory] = useState("");

  const [publishDate, setPublishDate] = useState("");
  const [directions, setDirections] = useState("");
  const [ingredients, setIngredients] = useState([]);
  const [ingredientName, setIngredientName] = useState("");

  function handleRecipeFormSubmit(e) {
    e.preventDefault();

    if (ingredients.length === 0) {
      alert("ingredients cannot be empty. Please add atleast 1 ingredient ");
    } else {
      const isPublished = new Date(publishDate) <= new Date() ? true : false;

      const newRecipe = {
        name,
        category,
        directions,
        publishDate: new Date(publishDate).toISOString(),
        unixTimeStampInMilliseconds: new Date().getTime(),
        isPublished,
        ingredients,
      };
      if (existingRecipe) {
        handleUpdateRecipe(newRecipe, existingRecipe.id);
      } else {
        handleAddRecipe(newRecipe);
      }
      resetForm();
    }
  }

  async function HandleDeleteIngredient(ingredientName) {
    const remainimgIngredients = ingredients.filter((ingredient) => {
      return ingredient !== ingredientName;
    });
    setIngredients(remainimgIngredients);
  }

  function resetForm() {
    setName("");
    setCategory("");
    setDirections("");
    setPublishDate("");

    setIngredients([]);
  }
  function handleAddIngredient(e) {
    if (e.key && e.key !== "Enter") {
      return;
    }
    e.preventDefault();

    if (!ingredientName) {
      alert("Missig ingredient field. Please double check");
      return;
    }

    setIngredients([...ingredients, ingredientName]);
    setIngredientName("");
  }

  return (
    <form
      onSubmit={handleRecipeFormSubmit}
      className="add-edit-recipe-form-container"
    >
      {existingRecipe ? (
        <h2 className="add-update-recipe-header">Update the Recipe</h2>
      ) : (
        <div>
          <h2 className="add-update-recipe-header">Add a New Recipe</h2>
        </div>
      )}
      <div className="top-form-section">
        <div className="fields">
          <label className="recipe-label input-label">
            Recipe Name:
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="input-text"
            />
          </label>
          <label className="recipe-label input-label">
            Category:
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
              className="select-category select"
            >
              <option value=""></option>
              <option value="breadsSanwhichsAndPizza">
                Breads, Sandwhiches, & Pizza
              </option>
              <option value="eggsAndBreakfast">Eggs & Breakfast</option>

              <option value="dessertsAndBakedGoods">
                Deserts & Baked Goods
              </option>
              <option value="fishAndSeafood">Fish & Seafood</option>

              <option value="vegtables">Vegtables</option>
            </select>
          </label>

          <label className="recipe-label input-label">
            Directions:
            <textarea
              required
              value={directions}
              onChange={(e) => setDirections(e.target.value)}
              className="input-text directions"
            ></textarea>
          </label>
          <label className="recipe-label input-label">
            Publish Date:
            <input
              required
              type="date"
              value={publishDate}
              onChange={(e) => setPublishDate(e.target.value)}
              className="input-text"
            />
          </label>
        </div>
      </div>

      <div className="ingredients-list">
        <h3 className="text-center">Ingredients</h3>
        <table className="ingredients-table">
          <thead>
            <tr>
              <th className="table-header">Ingredient</th>
              <th className="table-header">Delete</th>
            </tr>
          </thead>
          <tbody>
            {ingredients && ingredients.length > 0
              ? ingredients.map((ingredient) => {
                  return (
                    <tr key={ingredient}>
                      <td className="table-data text-center">{ingredient}</td>
                      <td className="ingredient-delete-box">
                        <button
                          onClick={() => HandleDeleteIngredient(ingredient)}
                          type="button"
                          className="secondary-button ingredient-delete-button"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  );
                })
              : null}
          </tbody>
        </table>
        {ingredients && ingredients.length === 0 ? (
          <h3 className="text-center no-ingredients">
            No Ingredients Added Yet
          </h3>
        ) : null}
        <div className="ingredient-form">
          <label className="ingredient-label">
            Ingredient:
            <input
              type="text"
              value={ingredientName}
              onChange={(e) => setIngredientName(e.target.value)}
              onKeyDown={handleAddIngredient}
              className="input-text"
              placeholder="ex. 1 cup of sugar"
            />
          </label>
          <button
            type="button"
            className="primary-button add-ingredient-button"
            onClick={handleAddIngredient}
          >
            Add Ingredient
          </button>
        </div>
      </div>
      <div className="action-buttons">
        <button type="submit" className="primary-button action-button">
          {existingRecipe ? "Update Recipe" : "  Create Recipe"}
        </button>
        {existingRecipe ? (
          <>
            <button
              className="primary-button action-button"
              type="button"
              onClick={handleEditRecipeCancel}
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => handleDeleteRecipe(existingRecipe.id)}
              className="primary-button action-button"
            >
              Delete
            </button>
          </>
        ) : null}
      </div>
    </form>
  );
}

export default AddEditRecipeForm;
