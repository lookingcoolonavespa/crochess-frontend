export function dynamicValidation(el: HTMLInputElement) {
  switch (el.name) {
    case 'time': {
      const val = el.value;
      if (typeof val !== 'number') {
        return { error: 'not a number' };
      }
      if (!val) return { error: 'must be greater than 0' };
    }

    case 'increment': {
      const val = el.value;
      if (typeof val !== 'number') {
        return { error: 'not a number' };
      }
    }

    case 'color': {
      const val = el.value;
      if (val !== 'black' && val !== 'white') {
        return { error: 'not a valid color' };
      }
    }

    default:
      return { isValid: true };
  }
}
