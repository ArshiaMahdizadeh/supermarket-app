import fs from "fs";
import path from "path";

const getRoutes = (dir = "app", basePath = "") => {
  let routes = [];
  const files = fs.readdirSync(dir);

  files.forEach((file) => {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      if (file.startsWith("(") && file.endsWith(")")) {
        
        routes = routes.concat(getRoutes(fullPath, basePath));
      } else {
        routes = routes.concat(getRoutes(fullPath, `${basePath}/${file}`));
      }
    } else if (file === "page.tsx" || file === "page.jsx") {
      routes.push(basePath || "/");
    }
  });

  return routes;
};

console.log(getRoutes("app"));
