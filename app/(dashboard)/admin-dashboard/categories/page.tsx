import { getAllCategory } from "../../_actions/categoryActions";
import Categories from "../../_components/categories/Categories";

const CategoriesPage = async () => {
  const result = await getAllCategory();

  return (
    <div className="space-y-6">
      <Categories categories={Array.isArray(result?.data) ? result.data : []} />
    </div>
  );
};

export default CategoriesPage;
