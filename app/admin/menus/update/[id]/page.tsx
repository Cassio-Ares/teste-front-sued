import { useParams } from "next/navigation";

const UpdateMenuPage = () => {
  const menuId = useParams();

  console.log(menuId);
  return (
    <div>
      <div>oiii</div>
    </div>
  );
};

export default UpdateMenuPage;
