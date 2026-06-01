const homeLink = document.createElement("a");

homeLink.className = "kimanh-home-link";
homeLink.href = "/";
homeLink.textContent = "← Ngôi Nhà Cầu Vồng";
homeLink.setAttribute("aria-label", "Quay về Ngôi Nhà Cầu Vồng");

document.addEventListener("DOMContentLoaded", () => {
  document.body.append(homeLink);
});
