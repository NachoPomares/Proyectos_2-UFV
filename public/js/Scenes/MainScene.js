// Clase para la escena que permite a los jugadores crear una partida
export default class MainScene extends Phaser.Scene{
  constructor() {
    super('MainScene');
    var sidebar;
    var rgb;
    var username;
    var volume_text;
  }
  init(data){
    this.userID = data.name;
  }
  // Cargar assets y otros elementos para usarlos más adelante
  preload() {
    this.load.image('tint', '../../assets/images/tintable.png');
    this.load.image('GH', '../../assets/images/GitHubLogo.png');
    this.load.image('UFV', '../../assets/images/LogoUFV.jpg');
    this.load.image('Pf', '../../assets/images/Pfp.png');
    this.load.html('RGB', '../../assets/html/RGB.html');
    this.load.html('Vol', '../../assets/html/Volumen.html');
    this.load.html('Join', '../../assets/html/CodigoPartida.html');
    this.load.html('Create', '../../assets/html/NumeroRounds.html');
  } 
  // Código que se ejecuta al iniciar el juego por primera vez
  create(){ 
    const gamescene = this;
    var bg = gamescene.add.image(this.game.canvas.width*0, this.game.canvas.height*0, 'tint').setScale(20,20).setTint('0xD7FAFE');
    // ----------------------- Color ---------------------------
    this.sidebar = this.add.image(this.game.canvas.width*0.35, this.game.canvas.height*0, 'tint').setOrigin(1,0).setScale(10,10).setTint(rgb2Hex(255, 255, 255));
    this.rgb = this.add.dom(this.game.canvas.width*0.18, this.game.canvas.height*0.4).createFromCache('RGB').setScale(1.25,1.25);
    this.username = this.add.text(this.game.canvas.width*0.18, this.game.canvas.height*0.23, this.userID.value, { color: 'black', align: 'center', fontFamily: 'Arial', fontSize: '32px'}).setOrigin(0.5,0);
    var profile = this.add.image(this.game.canvas.width*0.18, this.game.canvas.height*0.15, 'Pf').setScale(0.1,0.1);
    // --------------------- Fin de Color -------------------------
    // ----------------------- Volumen ---------------------------
    this.volume_text = this.add.text(this.game.canvas.width*0.18, this.game.canvas.height*0.63, 'Volumen', { color: 'black', align: 'center', fontFamily: 'Arial', fontSize: '32px'}).setOrigin(0.5,0);
    var volume = this.add.dom(this.game.canvas.width*0.18, this.game.canvas.height*0.7).createFromCache('Vol').setScale(1.5,1.5);
    // --------------------- Fin de Volumen -------------------------
    // -------------------------- Unirse a Partida -----------------------------
    var join_G = this.add.dom(this.game.canvas.width*0.67, this.game.canvas.height*0.2).createFromCache('Join');
    join_G.addListener('click');
    join_G.on('click', function(event){
      if(event.target.name === 'Unirse'){
        var codigo = this.getChildByName('codigopartida');
        if(codigo.value.length == 6){
          this.socket = io();
          gamescene.scene.start('Gameplay', {name: this.userID, socket: this.socket, join: 1, codigo: codigo.value});
        }
      }
    });
    // --------------------- Fin de Unirse a Partida -------------------------
    // -------------------------- Crear Partida -----------------------------
    var create_G = this.add.dom(this.game.canvas.width*0.67, this.game.canvas.height*0.6).createFromCache('Create');     
    create_G.addListener('click');
    create_G.on('click', function(event){
      if(event.target.name === 'Iniciar'){
        var noRondas = this.getChildByName('rondas');
        if(noRondas.value>3){
          noRondas.value = 3;
        }
        else if (noRondas.value<1){
          noRondas.value = 1;
        }
        console.log(noRondas.value);
        this.socket = io();
        gamescene.scene.start('Gameplay', {name: this.userID, socket: this.socket, join: 0, rondas: noRondas.value});
      }
    });
    // --------------------- Fin de Crear Partida -------------------------
    // -------------------------- Footer -----------------------------
    var footbar = this.add.image(this.game.canvas.width*0, this.game.canvas.height*0.80, 'tint').setOrigin(0,0).setScale(20,3).setTint('0x333333');
    var GitHub = this.add.image(this.game.canvas.width*0.30, this.game.canvas.height*0.9, 'GH').setScale(0.05,0.05).setInteractive({cursor: 'pointer'});
    var uniFV = this.add.image(this.game.canvas.width*0.70, this.game.canvas.height*0.9, 'UFV').setOrigin(0.75,0.5).setScale(0.08,0.08).setInteractive({cursor: 'pointer'});
    GitHub.on('pointerup', linkGH , this);
    uniFV.on('pointerup', linkUFV, this);
    // ---------------------- Fin de Footer --------------------------
  }
  // Código que se ejecutara cada frame (gameplay loop del juego)
  update(){
    this.sidebar = this.sidebar.setTint(rgb2Hex(this.rgb.getChildByName('R').valueAsNumber, this.rgb.getChildByName('G').valueAsNumber, this.rgb.getChildByName('B').valueAsNumber));
    if (this.rgb.getChildByName('R').value < 75 && this.rgb.getChildByName('G').value < 75 && this.rgb.getChildByName('B').value < 75){
      this.username.setColor('#FFFFFF');      
      this.volume_text.setColor('#FFFFFF');
      this.rgb.color = '#FFFFFF';
    }
    else {
      this.username.setColor('#000000');      
      this.volume_text.setColor('#000000');
      this.rgb.color = '#FFFFFF';
    }
    // actualizar valores bdd con el resultado de this.rgb.getChildByName('R').value para r g y b
  }
}

function pedirColores(){
  /* Pedir colores a la bdd */
      // En setTint de sidebar, meter los valores de r g y b de la bdd en la correspondiente funcion (como en update)
      // En los hijos de rgb ()  this.rgb.getChildByName('R').value = valor
}

function guardarColores(){
  /* Guardar colores en la bdd */
    // coger valores de los hijos y guardarlos en la bdd
}

function linkGH(){
  var s = window.open('https://github.com/ph0nsy/Proyectos_2-UFV', '_blank');
  if (s && s.focus)
  {
      s.focus();
  }
  else if (!s)
  {
      window.location.href = url;
  }
}

function linkUFV(){
  var s = window.open('https://www.ufv.es/estudiar/grado-informatica-madrid/plan-de-estudios/', '_blank');
  if (s && s.focus)
  {
      s.focus();
  }
  else if (!s)
  {
      window.location.href = url;
  }
}

function single2Hex(single_color) {
  var hex = single_color.toString(16);
  return hex.length == 1 ? "0" + hex : hex;
}

function rgb2Hex(r, g, b){
  return '0x' + (single2Hex(r) + single2Hex(g) + single2Hex(b));
}