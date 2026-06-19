function PageMeta({ title, description }) {
  document.title = title ? `${title} | HouseHunt` : "HouseHunt";
  const meta = document.querySelector('meta[name="description"]');
  if (meta && description) meta.setAttribute("content", description);
  else if (description) {
    const el = document.createElement("meta");
    el.name = "description";
    el.content = description;
    document.head.appendChild(el);
  }
  return null;
}

export default PageMeta;
