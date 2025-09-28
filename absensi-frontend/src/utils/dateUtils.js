export function getLastNDates(n, page) {
    const dates = [];
    const today = new Date();

    today.setDate(today.getDate() - (page - 1) * n);
    for (let i = 0; i < n; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      dates.push(date);
    }
    return dates;
  }