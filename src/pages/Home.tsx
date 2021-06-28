import { useHistory } from "react-router-dom";
import { Button } from "../components/Button";
import { useAuth } from "../hooks/useAuth";
import illustrationImg from "../assets/images/illustration.svg";
import logoImg from "../assets/images/logo.svg";
import googleImg from "../assets/images/google-icon.svg";

import "../styles/auth.scss";
import { FormEvent, useState } from "react";
import { database } from "../services/firebase";
import toast from "react-hot-toast";

export function Home() {
  const history = useHistory();
  const { user, signInWithGoogle } = useAuth();

  const [roomCode, setRoomCode] = useState('');

  async function handleCreateRoom() {
    if (!user) {
      await signInWithGoogle();
    }
    history.push("/rooms/new");
  }

  async function handleJoinRoom(event: FormEvent) {
    event.preventDefault();

    if(roomCode.trim() === "") {
      return;
    }

    const roomRef = await database.ref(`rooms/${roomCode}`).get();

    if(!roomRef.exists()) {
      toast.error('Sala não existente.');
      return;
    }

    if(roomRef.val().endedAt) {
      toast.error('A sala desejada foi encerrada.');
      return;
    }

    history.push(`/rooms/${roomCode}`);
  }

  return (
    <div id="page-auth">
      <aside>
        <img
          src={illustrationImg}
          alt="Ilustração simbolizando perguntas e respostas"
        />
        <strong>Crie salas de Q&amp;A ao-vivo</strong>
        <p>Tire as dúvidas da sua audiência em tempo-real</p>
      </aside>

      <main>
        <div className="main-content">
          <img src={logoImg} alt="Letmeask" />
          <button className="create-room" onClick={handleCreateRoom}>
            <img src={googleImg} alt="Logo do Google" />
            Crie sua sala com o Google
          </button>

          <div className="separator">ou entre em uma sala</div>

          <form onSubmit={handleJoinRoom}>
            <input 
              type="text" 
              placeholder="Digite o código da sala" 
              onChange={event => setRoomCode(event.target.value)}
              value={roomCode}
            />
            <Button>Entrar na sala</Button>
          </form>
        </div>
      </main>
    </div>
  );
}
