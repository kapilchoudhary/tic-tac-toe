import Ember from 'ember';

function checkIfWon(combo, symbol) {
  let won = false;
  combo.forEach((n) => {
    if(symbol.includes(n[0]) && symbol.includes(n[1]) && symbol.includes(n[2])){
      won = true;
    }
  });
  return won;
}

export default Ember.Controller.extend({
  cable: Ember.inject.service(''),
  session: Ember.inject.service(''),
  dataModel: Ember.computed.alias('model'),
  winningCombo: [ [1, 4, 7],[2, 5, 8],[3, 6, 9],[1, 2, 3],[4, 5, 6],[7, 8, 9],[1, 5, 9],[3, 5, 7]],
  subscription:null,
  notification:null,
  game_id:null,
  hover:false,
  hoverText:null,
  isUser: function() {
    return this.get('model.user_id') == this.get('session.data.authenticated.id');
  }.property('model.user_id'),
  init(){
    "use strict";
    this._super();
    this.set('board', Ember.Object.create({
      'first':[
        {box:1,symbol:''},  
        {box:2,symbol:''},  
        {box:3,symbol:''}
      ],
      'second':[  
        {box:4,symbol:''},  
        {box:5,symbol:''},  
        {box:6,symbol:''}
      ],
      'third':[ 
        {box:7,symbol:''},  
        {box:8,symbol:''},  
        {box:9,symbol:''}
      ]
    }));
    this.set('message','Waiting for another player'),
    this.set('reset', false);
    this.set('moves', Ember.Object.create({'X':[],'O':[],total:0}));
    this.set('playerSymbol', null);
    this.set('opponent_name', null);
    this.set('activePlayer', 'X');
  },
  actions:{
    getData(data){
      this.subscription = data.subscription;
      let action = data.action;
      if(data.game_id){
        this.set('game_id',data.game_id);
      }
      if(action == 'new_game'){
        this.init();
        this.set('message',null);
      }
      if(action == 'game_start'){
        this.init();
        Ember.run.later(()=>{ this.send('setPlayerSymbol',data); },1000)
      }else if(action == 'take_turn'){
        this.send('setMark',data.data);
      }else if(action == 'withdraw_game'){
        this.set('activePlayer',null);
        this.send('setMessage',`opponent withdraw game, You won.`);
      }
    },
    setPlayerSymbol(data){
      this.set('opponent_name',data.name);
      if(data.msg == 'cross'){
        this.set('message', `Let's go, It's your turn`);
        this.set('playerSymbol','X')
      }else{
        this.set('message', "Game started, It's "+ this.get('opponent_name') +"'s turn now, Wait for your turn");
        this.set('playerSymbol','O')
      }
    },
    setActivePlayer(){
      if(this.activePlayer == 'X'){
        this.set('activePlayer','O');
      }else{
        this.set('activePlayer','X');
      }
    },
    markBox(row,box){
      if(this.playerSymbol === this.activePlayer){
        if(box.symbol == ''){
          Ember.set(box, 'symbol', this.activePlayer);
          this.moves[this.activePlayer].push(box.box);
          let won = checkIfWon(this.winningCombo, this.moves[this.activePlayer]);
          this.get('moves').incrementProperty('total');

          this.get('subscription').perform('take_turn', {'item': {'col':box,'row':row,'won':won,'id':this.get('session.data.authenticated.id')},'game_id':this.get('game_id') });
          if(this.get('moves.total') == 9){
            this.set('reset',true);
            this.send('setMessage',`Game draw.`);
            this.get('subscription').perform('finish_game', {'winner_id':null,'game_id':this.get('game_id') });

          }else if(!won){
            this.send('setActivePlayer');
            this.send('setMessage',this.get('opponent_name')+"'s turn now.");
          }else{
            this.set('reset',true);
            this.send('setMessage','You won the game.');
            this.get('subscription').perform('finish_game', {'winner_id':this.get('session.data.authenticated.id'),'game_id':this.get('game_id') });

            this.set('activePlayer',null);
          }
        }
        
      }
    },

    setMark(data){
      let arr = this.board[data.row];
      let res = arr.find(obj => obj.box === data.col.box);
      Ember.set(res, 'symbol', data.col.symbol);
      this.get('moves').incrementProperty('total');
      if(this.get('moves.total') == 9){
        this.set('reset',true);
        this.send('setMessage',`Game draw.`);
      }else if(!data.won){
        this.send('setActivePlayer');
        this.send('setMessage',`It's your turn now.`);
      }else{
        this.set('reset',true);
        this.send('setMessage','Player '+ this.get('opponent_name')+' won the game.');
      }
    },
    setMessage(msg){
      this.set('message',msg);
    },
    clearBoard(){
      this.init();
    },
    withdrawGame() {
      this.get('subscription').perform('withdraw_game', {'user_id':this.get('session.data.authenticated.id'),'game_id':this.get('game_id') });

    },
    startGame() {
      this.get('subscription').perform('start_game', {'game_id': this.get('game_id') });
    },
  }
});
