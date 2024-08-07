export const validatePassword = (password: string) => {
  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/;
  if (!passwordRegex.test(password)) {
    throw new Error('Weak password. Must be at least 6 chars, 1 letter, 1 number.');
  }
};

export const validateBirthDate = (birthDate: string) => {
  const dateRegex = /^(\d{2})-(\d{2})-(\d{4})$/;
  if (!dateRegex.test(birthDate)) {
    throw new Error('Invalid date format. Use DD-MM-YYYY.');
  }

  const [day, month, year] = birthDate.split('-').map(Number);
  const date = new Date(year, month - 1, day);
  if (date.getFullYear() !== year || date.getMonth() !== month - 1 || date.getDate() !== day) {
    throw new Error('Invalid date. Please check the values.');
  }
};
