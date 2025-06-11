import firebase from "@/configs/firebase";
import { createUserWithEmailAndPassword, getAuth, signInWithEmailAndPassword, signOut, UserCredential } from "firebase/auth"
import axios from "axios";

const auth = getAuth(firebase);

const cpfToEmail = (cpf: string): string => {
  // Permitir exceção para "admin"
  if (cpf === 'admin') {
    return 'admin@kasebox.com';
  }

  const cleanCpf = cpf.replace(/\D/g, '');

  // Valida se o CPF tem exatamente 11 dígitos
  if (cleanCpf.length !== 11) {
    throw new Error('CPF inválido para conversão de e-mail.');
  }

  return `${cleanCpf}@kasebox.com`;
};

const registerUser = async (cpf: string, password: string) => {
    try {
        const email = cpfToEmail(cpf);
        const { user } = await createUserWithEmailAndPassword(auth, email, password);
        await axios.post('http://localhost:8080/auth/registar', {
            uid: user.uid
        })
        
        return;
    } catch (error) {
        throw error;
    }
}

const loginUser = async (cpf: string, password: string): Promise<UserCredential> => {
    try {
        const email = cpfToEmail(cpf)
        return await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
        throw error;
    }
}


const logoutUser = async () => {
  try {
    const token = await auth.currentUser?.getIdToken(true);
    await signOut(auth);
    if (token) {
      await axios.post('http://localhost:8080/auth/logout', null, {
        headers: { Authorization: `Bearer ${token}` }
      })
    }


    console.log('Logout efetuado no backend e frontend');
  } catch (error) {
    console.error('Erro ao fazer logout:', error);
    throw error;
  }
};


export { registerUser, loginUser, logoutUser };
export default auth;
