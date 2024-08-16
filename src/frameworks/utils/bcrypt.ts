import bcrypt from 'bcrypt';

export const comparePassword = async (userPassword: string, dbPassword: string): Promise<boolean> => {
  try {
    const result = await bcrypt.compare(userPassword, dbPassword);
    console.log("util", userPassword);
    console.log("util", dbPassword);
    console.log(result);


    return result;
  } catch (error) {
    console.error('Error comparing passwords', error);
    throw new Error('Error comparing passwords');
  }
};
