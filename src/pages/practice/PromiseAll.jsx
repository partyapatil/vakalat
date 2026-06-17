const PromiseAllpage = (getall) => {
    return new Promise((res, rej) => {

    Promise.all(getall).then(e=>console.log(resolved))
  });
};

export default PromiseAllpage;
