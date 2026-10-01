import { ResourcePage } from "../components/resource/ResourcePage.jsx";
import { moduleRegistry } from "../modules/registry.js";

// Renders the module registered for `page`; unknown keys fall back to a generic resource page.
export function PageRouter({ page, user }) {
  const module = moduleRegistry[page];
  if (module?.Page) return <module.Page key={page} user={user} />;
  return <ResourcePage key={page} config={module?.config || { resource: page }} user={user} />;
}
