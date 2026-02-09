//enable loading
function enableLoading() {
  const loader = document.querySelector('.loading-container');

  document.body.classList.add('is-loading');
  if (loader) loader.classList.remove('hide');
}

//disable loading
function disableLoading() {
  const loader = document.querySelector('.loading-container');

  document.body.classList.remove('is-loading');
  if (loader) loader.classList.add('hide');
}

export { enableLoading, disableLoading };
