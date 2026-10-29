document.getElementById("ano").textContent = new Date().getFullYear();

const emailTexto = document.getElementById("email-texto").innerText.trim();
const toastEmail = bootstrap.Toast.getOrCreateInstance(document.getElementById("toast-email"));

function copiarComFallback(texto) {
  const campo = document.createElement("textarea");
  campo.value = texto;
  campo.style.position = "fixed";
  campo.style.opacity = "0";
  document.body.appendChild(campo);
  campo.select();
  document.execCommand("copy");
  document.body.removeChild(campo);
}

document.getElementById("copiar-email").addEventListener("click", function () {
  const avisar = function () { toastEmail.show(); };

  if (navigator.clipboard && window.isSecureContext) {
    navigator.clipboard.writeText(emailTexto).then(avisar).catch(function () {
      copiarComFallback(emailTexto);
      avisar();
    });
  } else {
    copiarComFallback(emailTexto);
    avisar();
  }
});

const formContato = document.getElementById("form-contato");
const avisoSucesso = document.getElementById("sucesso");

formContato.addEventListener("submit", function (e) {
  e.preventDefault();
  avisoSucesso.classList.add("d-none");

  if (!formContato.checkValidity()) {
    formContato.classList.add("was-validated");
    return;
  }

  formContato.reset();
  formContato.classList.remove("was-validated");
  avisoSucesso.classList.remove("d-none");
});

const CHAVE_PERFIL = "perfilCurriculoRenan";
localStorage.removeItem("perfil");

const campoNome = document.getElementById("editNome");
const campoCargo = document.getElementById("editCargo");
const campoResumo = document.getElementById("editResumo");

function mostrarPerfil(perfil) {
  document.getElementById("nomePerfil").innerText = perfil.nome || "Seu Nome";
  document.getElementById("cargoPerfil").innerText = perfil.cargo || "Cargo Desejado";
  document.getElementById("resumoPerfil").innerText = perfil.resumo || "Seu resumo profissional.";
}

function salvarPerfil(e) {
  e.preventDefault();
  const perfil = {
    nome: campoNome.value,
    cargo: campoCargo.value,
    resumo: campoResumo.value
  };
  localStorage.setItem(CHAVE_PERFIL, JSON.stringify(perfil));
  mostrarPerfil(perfil);
}

document.getElementById("form-perfil").addEventListener("submit", salvarPerfil);

document.getElementById("limpar").addEventListener("click", function () {
  localStorage.removeItem(CHAVE_PERFIL);
  campoNome.value = "";
  campoCargo.value = "";
  campoResumo.value = "";
  mostrarPerfil({});
});

const perfilSalvo = JSON.parse(localStorage.getItem(CHAVE_PERFIL));
if (perfilSalvo) {
  mostrarPerfil(perfilSalvo);
  campoNome.value = perfilSalvo.nome;
  campoCargo.value = perfilSalvo.cargo;
  campoResumo.value = perfilSalvo.resumo;
}

const botaoTema = document.getElementById("tema");

function aplicarTema(escuro) {
  document.body.classList.toggle("dark", escuro);
  botaoTema.innerText = escuro ? "Tema claro" : "Tema escuro";
}

aplicarTema(sessionStorage.getItem("tema") === "dark");

botaoTema.addEventListener("click", function () {
  const escuro = !document.body.classList.contains("dark");
  sessionStorage.setItem("tema", escuro ? "dark" : "light");
  aplicarTema(escuro);
});

const cookieVisita = document.cookie
  .split("; ")
  .find(function (c) { return c.startsWith("ultimaVisita="); });

const textoVisita = document.getElementById("visita");
if (cookieVisita) {
  textoVisita.innerText = "Última visita: " + decodeURIComponent(cookieVisita.split("=")[1]);
} else {
  textoVisita.innerText = "Primeira visita registrada.";
}

document.cookie =
  "ultimaVisita=" + encodeURIComponent(new Date().toLocaleDateString("pt-BR")) +
  "; max-age=31536000; path=/";