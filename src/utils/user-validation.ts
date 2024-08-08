import { ErrorMessages } from '../errors/error-messages.js';

export const validatePassword = (password: string) => {
  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/;
  if (!passwordRegex.test(password)) {
    throw ErrorMessages.weakPassword();
  }
};

export const validateBirthDate = (birthDate: string) => {
  const dateRegex = /^(\d{2})-(\d{2})-(\d{4})$/;
  if (!dateRegex.test(birthDate)) {
    throw ErrorMessages.invalidBirthDate();
  }

  const [day, month, year] = birthDate.split('-').map(Number);
  const date = new Date(year, month - 1, day);
  if (date.getFullYear() !== year || date.getMonth() !== month - 1 || date.getDate() !== day) {
    throw ErrorMessages.invalidDate();
  }
};
