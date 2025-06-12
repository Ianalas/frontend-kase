// AuthContext.tsx
import { User } from "@/interfaces/User";
import auth from "@/services/authService"; // Certifique-se de que o caminho está correto
import { onAuthStateChanged } from "firebase/auth";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
// Importe a função setAuthToken do seu arquivo axios.ts
import { setAuthToken } from "@/lib/axiosUser"; // <--- ATENÇÃO: Corrija este caminho!

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
}

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState<string | null>(null);

  // Efeito para observar mudanças no estado de autenticação do Firebase
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          const tokenResult = await firebaseUser.getIdTokenResult();
          const newToken = tokenResult.token;
          console.log(newToken);
          setToken(newToken);
          setAuthToken(newToken); 

          const role = tokenResult.claims.role;

          setUser({
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            displayName: firebaseUser.displayName,
            photoURL: firebaseUser.photoURL,
            emailVerified: firebaseUser.emailVerified,
            role,
          });
        } catch (error) {
          console.error("Erro ao obter token ou informações do usuário:", error);
          setToken(null);
          setAuthToken(null); // Limpa o token em caso de erro
          setUser(null);
        }
      } else {
        setToken(null);
        setAuthToken(null); // <--- Limpa o token quando o usuário desloga
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []); 


  useEffect(() => {
    
  }, [token]); 

  return (
    <AuthContext.Provider value={{ user, token, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth deve ser usado dentro de um AuthProvider");
  }
  return context;
};