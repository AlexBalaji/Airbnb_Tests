// Function to add days to the current date
export function addDays(date: Date, days: number): Date {
    const newDate = new Date(date);
    newDate.setDate(date.getDate() + days); // Add the number of days to the date
    return newDate;
  }
  
  // Function to transform single digit numbers with leading zero
 function putZero(num: number): string {
    return num < 10 ? `0${num}` : `${num}`;
  }
  
  // Function to format the date as month/day/year
export function formatDate(date: Date): string {
    const month = putZero(date.getMonth() + 1); // getMonth() returns 0-based month (0 = January)
    const day = putZero(date.getDate());
    const year = date.getFullYear();
    return `${month}/${day}/${year}`;
  }