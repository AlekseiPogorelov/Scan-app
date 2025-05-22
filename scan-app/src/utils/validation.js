export const validateSearchForm = (values) => {
  const errors = {};

  if (!values.inn) {
    errors.inn = 'Обязательное поле';
  } else if (!/^\d{10}$/.test(values.inn)) {
    errors.inn = 'Неверный формат ИНН';
  }

  if (values.startDate > new Date()) {
    errors.startDate = 'Дата не может быть в будущем';
  }

  return errors;
};
