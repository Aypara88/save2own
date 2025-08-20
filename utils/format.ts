export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

export const formatDate = (date: string): string => {
  return new Date(date).toLocaleDateString("en-NG", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

export const formatPhoneNumber = (phone: string): string => {
  // Format Nigerian phone number
  if (phone.startsWith("0")) {
    phone = phone.substring(1);
  }
  return `+234${phone}`;
};