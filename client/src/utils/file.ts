export const fileToBase64 = (file: File) => {
    return new Promise((resolve, reject) => {
        const fileReader = new FileReader();
        fileReader.onload = (event) => {
          const result = event.target!.result as string;
          resolve(result.split(',')[1]);
        };
        fileReader.readAsDataURL(file);
    });
};

export const fileName = (file: File) => {
  const nameArray = file.name.split('.');
  nameArray.pop();
  return nameArray.join('');
}