const preview = document.querySelector('.pos-lightbox');
const previewImage = document.querySelector('#pos-preview-image');
const previewCaption = document.querySelector('#pos-preview-caption');

// Keep the image links usable when the browser cannot open a native dialog.
document.querySelectorAll('[data-preview]').forEach(link => {
  link.addEventListener('click', event => {
    if (!preview?.showModal || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    previewImage.src = link.href;
    previewImage.alt = link.querySelector('img').alt;
    previewCaption.textContent = link.dataset.caption;
    preview.showModal();
  });
});
