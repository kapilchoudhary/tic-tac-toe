import Ember from 'ember';

function checkIfWon(combo, symbol) {
	let won = false;
	combo.forEach((n) => {
	  if(symbol.includes(n[0]) && symbol.includes(n[1]) && symbol.includes(n[2])){
	    console.log('true')
	    won = true;
	  }
	});
	return won;
}

export default Ember.Controller.extend({
	cable: Ember.inject.service(''),
	session: Ember.inject.service(''),
	winningCombo: [ [1, 4, 7],[2, 5, 8],[3, 6, 9],[1, 2, 3],[4, 5, 6],[7, 8, 9],[1, 5, 9],[3, 5, 7]],
	reset:false,
	subscription:null,
	notification:null,
	game_id:null,
	message:'Waiting for another player.',
	init(){
		this._super(...arguments);
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
		this.moves = {'X':[],'O':[]};
		this.playerSymbol = null;
		this.activePlayer = 'X';
		if(this.subscription == null){
			this.send('connectToCable');
		}
		
	},
	actions:{
		getData(data){
			this.subscription = data.subscription;
			let action = data.action;
			if(action == 'new_game'){
				this.init();
			}
			if(action == 'game_start'){
				this.set('game_id',data.game_id);
				this.send('setPlayerSymbol',data.msg);

			}else if(action == 'take_turn'){

				this.send('setMark',data.data);
				
			}
		},
		setPlayerSymbol(type){
			if(type == 'cross'){
				this.set('message', `Let's go, It's your turn`);
				this.set('playerSymbol','X')
			}else{
				this.set('message', `Game started, It's player X turn now, Wait for your turn`);
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
					this.moves[this.activePlayer].push(box.box)
					let won = checkIfWon(this.winningCombo, this.moves[this.activePlayer]);
					this.get('subscription').perform('take_turn', {'item': {'col':box,'row':row,'won':won,'id':this.get('session.data.authenticated.id')},'game_id':this.get('game_id') });
					if(!won){
						this.send('setActivePlayer');
						this.send('setMessage','Player '+this.activePlayer+' turn now.');
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
			if(!data.won){
				this.send('setActivePlayer');
				this.send('setMessage',`It's your turn now.`);
			}else{
				this.set('reset',true);
				this.send('setMessage','Player '+ data.col.symbol+' won the game.');
			}
		},
		setMessage(msg){
			this.set('message',msg);
		}
	}
});
