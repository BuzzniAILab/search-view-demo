type StorageValue<T> = T | null;

export const setToLocalStorage = <T>(key: string, value: T): void => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    // console.error(`로컬 스토리지 저장 중 오류남: ${error}`);
  }
};

export const getFromLocalStorage = <T>(
  key: string,
  initialValue?: T
): StorageValue<T> => {
  try {
    const storedValue = localStorage.getItem(key);
    return storedValue ? JSON.parse(storedValue) : initialValue;
  } catch (error) {
    // console.error(`로컬 스토리지 값을 가져오는데 오류남: ${error}`);
    return null;
  }
};
