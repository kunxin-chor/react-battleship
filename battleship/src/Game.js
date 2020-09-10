import React from 'react'

class Game extends React.Component{

    componentDidMount() {        
        this.initGame()
    }

    state = {
        battlefield: [],
        formation_count: 1,
        formation_countb: 1,
        storage_A: [
            [], [], [], [], [], [], [], [], [], [], [], []
        ],
        storage_B: [
            [], [], [], [], [], [], [], [], [], [], [], []
        ],
        fleetB: [5 , 4 , 3, 3, 2],
        fleetB_logo: ['C' , 'B' , 'c' , 'S' , 'D'],
        //In dir_check array, left, right, bottom, top
        //                    west, east, south, north
        dir_check: [],
        dir_id: [0,0,0,0],
        eligible_dir: 0,
        is_eligible: 0,
        
        battlefield_mirror: [],
        setup_A: 0,
        startGame: 0,

        carrierB: 5,
        carrierA: 5,

        battleshipB: 4,
        battleshipA: 4,

        cruiserB: 3,
        cruiserA: 3,

        submarineB: 3,
        submarineA: 3,        

        destroyerB: 2,
        destroyerA: 2,

        successfulHitsA: 0,
        successfulHitsB: 0,

        playerA_turn: 0,
        playerB_turn: 0,

        game_victory: 0,

        setupCount: 0,
    }

    initGame = () => {
        this.setState({
            battlefield: this.createBattlefield([]),
            storage_A: this.createBattlefield([]),
            storage_B: this.createBattlefield([])
        })
    }

    refreshBattlefield = () => {
        this.setState({
            battlefield: this.createBattlefield([]),
        })
    }
    createBattlefield = (arr) => {
        for(let i = 0; i < 12; i++){
            arr.push([])
            for(let j = 0; j < 12; j++){
                arr[i].push('')
            }
        }
    return arr;
    }

    showNewbattlefield = () => {
        this.setState({
            battlefield_mirror: this.createBattlefield([]),
        })
    }

    renderSquares(row){
        let rendered_squares = [];
        if((this.state.setup_A == 0) && (this.state.startGame == 0)){
            for(let index = 0; index < this.state.storage_A[row].length; index++){
                let square = this.state.storage_A[row][index]
                let square_key = row*10 + index 
                rendered_squares.push(
                    <td key = {square_key} onClick = {() => {this.updateFormationA(row , index)}}>
                        {square}
                    </td>
                )
            }                
        }
        
        else if((this.state.setup_A == 1) && (this.state.startGame == 0)){
            for(let index = 0; index < this.state.storage_B[row].length; index++){
                let square = this.state.storage_B[row][index]
                let square_key = row*10 + index 
                rendered_squares.push(
                    <td key = {square_key} onClick = {() => {this.updateFormationB()}}>
                        {square}
                    </td>
                )
            }    
        }
        else if((this.state.setup_A == 1) && (this.state.startGame == 1)){
            for(let index = 0; index < this.state.battlefield[row].length; index++){
                let square = this.state.battlefield[row][index]
                let square_key = row*10 + index 
                rendered_squares.push(
                    <td key = {square_key} onClick = {() => {this.gamePlay(row , index)}}>
                        {square}
                    </td>
                )
            }    

        }
        else{
            alert("Oopsies, please refresh")
        }


    return rendered_squares
    }

    

    updateFormationA = async (row , col) => {
        let row_copy = [...this.state.battlefield[row]]
        let storage_A_copy = [...this.state.storage_A]
        
        if(this.state.setup_A == 0){

            if((row_copy[col] == '') && (this.state.formation_count <= 5)){
                row_copy[col] = 'C'
                storage_A_copy[row][col] = 'C'
            }
            else if((row_copy[col] == '') && (this.state.formation_count >= 6) && (this.state.formation_count <= 9)){
                row_copy[col] = 'B'
                storage_A_copy[row][col] = 'B'
            }
            else if((row_copy[col] == '') && (this.state.formation_count >= 10) && (this.state.formation_count <= 12)){
                row_copy[col] = 'c'
                storage_A_copy[row][col] = 'c'
            }
            else if((row_copy[col] == '') && (this.state.formation_count >= 13) && (this.state.formation_count <= 15)){
                row_copy[col] = 'S'
                storage_A_copy[row][col] = 'S'
            }
            else if((row_copy[col] == '') && (this.state.formation_count >= 16) && (this.state.formation_count <= 17)){
                row_copy[col] = 'D'
                storage_A_copy[row][col] = 'D'
            }
            else{
                return
            }
            let battlefield_copy = [...this.state.battlefield]
            battlefield_copy[row] = row_copy
        
            await this.setState({
                battlefield: battlefield_copy,
                formation_count: ++this.state.formation_count,
                storage_A: storage_A_copy

            })

            if(this.state.formation_count == 18){
                alert("Refreshing the battlefield for player B to form up")
                this.setState({
                    setup_A: 1
                })
            }
    
        }
    }

    /*
    updateFormationB = async (row , col) => {
        let row_copy = [...this.state.battlefield[row]]
        let storage_B_copy = [...this.state.storage_B]
        if((row_copy[col] == '') && (this.state.formation_countb <= 5)){
            row_copy[col] = 'C'
            storage_B_copy[row][col] = 'C'
        }
        else if((row_copy[col] == '') && (this.state.formation_countb >= 6) && (this.state.formation_countb <= 9)){
            row_copy[col] = 'B'
            storage_B_copy[row][col] = 'B'
        }
        else if((row_copy[col] == '') && (this.state.formation_countb >= 10) && (this.state.formation_countb <= 12)){
            row_copy[col] = 'c'
            storage_B_copy[row][col] = 'c'
        }
        else if((row_copy[col] == '') && (this.state.formation_countb >= 13) && (this.state.formation_countb <= 15)){
            row_copy[col] = 'S'
            storage_B_copy[row][col] = 'S'
        }
        else if((row_copy[col] == '') && (this.state.formation_countb >= 16) && (this.state.formation_countb <= 17)){
            row_copy[col] = 'D'
            storage_B_copy[row][col] = 'D'
        }
        else{
            return
        }
        let battlefield_copy = [...this.state.battlefield]
        battlefield_copy[row] = row_copy
        await this.setState({
            battlefield: battlefield_copy,
            formation_count: ++this.state.formation_countb,
            storage_B: storage_B_copy
        })

        if(this.state.formation_countb == 18){
            this.setState({
                playerA_turn: 1,
                startGame: 1
            })
            this.gamePlaySet()
            alert("Player A may initiate the battle! May the best fleet win!")
        }
    }
    */

    chooseDirection = async (max_num) => {
       
        let rand_num = 0;
        let biggest = 0;
        let dir_record = 0;
        let dir_id_clone = [...this.state.dir_id]

        if(this.state.eligible_dir == 1){
            for(let i = 0; i < this.state.dir_check.length; i++){
                if(this.state.dir_check[i] == max_num){
                    dir_id_clone[i] = 1
                }
            }
        }
        else{
            for(let j = 0; j < this.state.dir_check.length; j++){
                if(this.state.dir_check[j] == max_num){
                    dir_id_clone[j] = 1
                }
            }
        }
        await this.setState({
            dir_id: dir_id_clone
        })
        console.log("Direction_ID")
        console.log(this.state.dir_id)

        for(let k = 0; k < this.state.dir_id.length; k++){
            if(this.state.dir_id[k] == 1){
                rand_num = Math.floor(Math.random()*100) + 1;
                if(rand_num > biggest){
                    biggest = rand_num
                    console.log(rand_num)
                    dir_record = k
                }
            
            }
        }
        console.log("Direction chosen =", dir_record)
    return dir_record  
    }

    betweenTwoNum = (min , max) => {
        let numGen = Math.floor(
            Math.random() * (max - min + 1) + min
        )
    return numGen
    }
    //Put this function as part of the loop for looping through fleet B
    countFreeSpace = async (row , col ,  max_num , storage_B_copy) => {
        console.log("countFrespace")
        let count_num = [0 , 0, 0 , 0]
        let temp_col = 0;
        let temp_row = 0;
        let count = 1;
        let directions_arr = [ 
            [-1 , 0] , [1 , 0] , [0 , 1] , [0 , -1]
        ]
        let dir_count = 0;
        console.log("start row=", row, "start col=", col)
        for(let i = 0; i < 4; i++){
            temp_col = col;
            temp_row = row;
            count = 0
            while((temp_col >= 0) && (temp_col <= 11) && (temp_row >= 6) && (temp_row <= 11)){            
                if(storage_B_copy[temp_row][temp_col] == ''){
                    count++;
                    if(count == max_num){
                        count_num[i] = count;
                        break;
                    }                    
                }  
                temp_col = temp_col + directions_arr[i][0]
                temp_row = temp_row + directions_arr[i][1]            
            }
        }
        for(let j = 0; j < count_num.length; j++){
            if(count_num[j] == max_num){
                dir_count++
            }
        }
        if(dir_count >= 1){
            // this.setState({
            //     eligible_dir: dir_count,
            //     is_eligible: 1
            // })
            await this.setState({
                eligible_dir: dir_count,
                dir_check: count_num
            })
            console.log("Count num:", count_num)
            return true;
        } else {
            return false;
        }
    
    }

    checkSlot = (row , col , storage_B_copy) => {
        do{
            row = this.betweenTwoNum(6 , 11)
            col = this.betweenTwoNum(0 , 11)  
        }
        while(storage_B_copy[row][col] != '')

    return [row , col]      
    }

    updateFormationB = async () => {
        //Fill up B side of the battlefield with ''
        let storage_B_copy = [...this.state.storage_B]
        let row = 0;
        let col = 0;

        for(let r = 0; r < 12; r++){
            for(let c = 0; c < 12; c++){
                storage_B_copy[r][c] = ''
            }
        } 

        //fleetB_logo: ['C' , 'B' , 'c' , 'S' , 'D'],
        //fleetB: ['5' , '4' , '3' , '3' , '2']
        
        for(let i = 0; i < this.state.fleetB.length; i++){
            let direction = 0;
            let is_eligible = false;
            while(is_eligible==false){
                [row , col] = this.checkSlot(row, col , [...storage_B_copy])
                is_eligible = await this.countFreeSpace(row , col , this.state.fleetB[i], [...storage_B_copy])    
            }
            direction = await this.chooseDirection(this.state.fleetB[i])
            console.log("Putting ind direction=", direction)

            for (let j=0; j < this.state.fleetB[i]; j++) {
                console.log("Dir=", direction, "row=", row, "col=", col)
                storage_B_copy[row][col] = this.state.fleetB_logo[i];
                if (direction==1) {
                    col--;
                } 
                else if (direction==2) {
                    col++;
                }
                else if (direction ==3) {
                    row++;
                } 
                else {
                    row--;
                }
            }

            // if(direction == 1){
            //     for(let j = 0; j < this.state.fleetB[i]; j++){
            //         storage_B_copy[row][col] = this.state.fleetB_logo[i]
            //         col--;
            //     }
            // }
            // else if(direction == 2){
            //     for(let k = 0; k < this.state.fleetB[i]; k++){
            //         storage_B_copy[row][col] = this.state.fleetB_logo[i]
            //         col++
            //     }
            // }
            // else if(direction == 3){
            //     for(let m = 0; m < this.state.fleetB[i]; m++){
            //         storage_B_copy[row][col] = this.state.fleetB_logo[i]
            //         row++
            //     }
            // }
            // else{
            //     for(let n = 0; n < this.state.fleetB[i]; n++){
            //         console.log(storage_B_copy);
            //         console.log(row, col)
            //         console.log(storage_B_copy[row][col])
            //         storage_B_copy[row][col] = this.state.fleetB_logo[i]
            //         row--
            //     }
            // }
 
        }
        this.setState({
            storage_B: storage_B_copy
        })
    }

    gamePlaySet = () => {
        this.setState({
            battlefield_mirror: this.state.battlefield,
        })
        this.refreshBattlefield();    
    }

    gamePlay = (row , col) => {
        
        if(this.state.playerA_turn == 1){
            if((row >= 0) && (row <= 5)){
                alert("Oopsies, please do not commit fratricide")
            }
            else if((this.state.battlefield[row][col] == 'X') || (this.state.battlefield[row][col] == 'O')){
                alert("Don't waste your ammuniation unnecessarily!")
            }
            else{
                if(this.state.storage_B[row][col] == ''){
                    this.state.battlefield[row][col] = 'O'
                    alert("You missed!")
                }
                else if(this.state.storage_B[row][col] == 'C'){
                    this.state.battlefield[row][col] = 'X'
                    this.setState({
                        carrierB: this.state.carrierB - 1,
                        successfulHitsA: this.state.successfulHitsA + 1
                    })
                    alert("You have hit a part of a carrier, Wow!")
                    if(this.state.carrierB == 0){
                        alert("Player B carrier is sunk!")
                    }
                }
                else if(this.state.storage_B[row][col] == 'B'){
                    this.state.battlefield[row][col] = 'X'
                    this.setState({
                        battleshipB: this.state.battleshipB - 1,
                        successfulHitsA: this.state.successfulHitsA + 1
                    })
                    alert("You have hit a part of a battleship, Wow!")
                    if(this.state.battleshipB == 0){
                        alert("Player B battleship is sunk!")
                    }
                }
                else if(this.state.storage_B[row][col] == 'c'){
                    this.state.battlefield[row][col] = 'X'
                    this.setState({
                        cruiserB: this.state.cruiserB - 1,
                        successfulHitsA: this.state.successfulHitsA + 1
                    })
                    alert("You have hit a part of a crusier, Wow!")
                    if(this.state.cruiserB == 0){
                        alert("Player B cruiser is sunk!")
                    }
                }
                else if(this.state.storage_B[row][col] == 'S'){
                    this.state.battlefield[row][col] = 'X'
                    this.setState({
                        submarineB: this.state.submarineB - 1,
                        successfulHitsA: this.state.successfulHitsA + 1
                    })
                    alert("You have hit a part of a submarine, Wow!")
                    if(this.state.submarineB == 0){
                        alert("Player B submarine is sunk!")
                    }
                }
                else if(this.state.storage_B[row][col] == 'D'){
                    this.state.battlefield[row][col] = 'X'
                    this.setState({
                        destroyerB: this.state.destroyerB - 1,
                        successfulHitsA: this.state.successfulHitsA + 1
                    })
                    alert("You have hit a part of a destroyer, Wow!")
                    if(this.state.destroyerB == 0){
                        alert("Player B destroyer is sunk!")
                    }
                }
                else{
                    return
                }    
                alert("Player B turn")
                this.setState({
                    playerA_turn: 0,
                    playerB_turn: 1
                })
            }
        }
        else{
            if((row >= 6) && (row <= 11)){
                alert("Oopsies, please do not commit fratricide")
            }
            else if((this.state.battlefield[row][col] == 'X') || (this.state.battlefield[row][col] == 'O')){
                alert("Don't waste your ammuniation unnecessarily!")
            }
            else{
                if(this.state.storage_A[row][col] == ''){
                    this.state.battlefield[row][col] = 'O'
                    alert("You missed!")
                }
                else if(this.state.storage_A[row][col] == 'C'){
                    this.state.battlefield[row][col] = 'X'
                    this.setState({
                        carrierA: this.state.carrierA - 1,
                        successfulHitsB: this.state.successfulHitsB + 1
                    })
                    alert("You have hit a part of a carrier, Wow!")
                    if(this.state.carrierA == 0){
                        alert("Player A carrier is sunk!")
                    }
                }
                else if(this.state.storage_A[row][col] == 'B'){
                    this.state.battlefield[row][col] = 'X'
                    this.setState({
                        battleshipA: this.state.battleshipA - 1,
                        successfulHitsB: this.state.successfulHitsB + 1
                    })
                    alert("You have hit a part of a battleship, Wow!")
                    if(this.state.battleshipA == 0){
                        alert("Player A battleship is sunk!")
                    }
                }
                else if(this.state.storage_A[row][col] == 'c'){
                    this.state.battlefield[row][col] = 'X'
                    this.setState({
                        cruiserA: this.state.cruiserA - 1,
                        successfulHitsB: this.state.successfulHitsB + 1
                    })
                    alert("You have hit a part of a crusier, Wow!")
                    if(this.state.cruiserA == 0){
                        alert("Player A cruiser is sunk!")
                    }
                }
                else if(this.state.storage_A[row][col] == 'S'){
                    this.state.battlefield[row][col] = 'X'
                    this.setState({
                        submarineA: this.state.submarineA - 1,
                        successfulHitsB: this.state.successfulHitsB + 1
                    })
                    alert("You have hit a part of a submarine, Wow!")
                    if(this.state.submarineA == 0){
                        alert("Player A submarine is sunk!")
                    }
                }
                else if(this.state.storage_A[row][col] == 'D'){
                    this.state.battlefield[row][col] = 'X'
                    this.setState({
                        destroyerA: this.state.destroyerA - 1,
                        successfulHitsB: this.state.successfulHitsB + 1
                    })
                    alert("You have hit a part of a destroyer, Wow!")
                    if(this.state.destroyerA == 0){
                        alert("Player A destroyer is sunk!")
                    }
                }
                else{
                    return
                } 
                
                
                alert("Player A turn")
                this.setState({
                    playerA_turn: 1,
                    playerB_turn: 0
                })
            }

        }
        if((this.state.successfulHitsA == 17) && (this.state.game_victory != 1)){
            alert("Player A is the king of the battlefield! Restarting game....")
            this.initGame();
        }
        else if((this.state.successfulHitsB== 17) && (this.state.game_victory != 1)){
            alert("Player B is the king of the battlefield! Restarting game....")
            this.initGame();
        }
        else{
            return
        }
    }


    render(){
        if(this.state.battlefield.length == 0){
            return(<div></div>)
        }
        return(
            <div>
                <h1>Welcome to Battleship</h1>
                <table>
                    <tr>
                        {this.renderSquares(0)}
                    </tr>

                    <tr>
                        {this.renderSquares(1)}
                    </tr>

                    <tr>
                        {this.renderSquares(2)}     
                    </tr>

                    <tr>
                        {this.renderSquares(3)}
                    </tr>

                    <tr>
                        {this.renderSquares(4)}
                    </tr>

                    <tr>
                        {this.renderSquares(5)}
                    </tr>

                    <tr>
                        {this.renderSquares(6)}
                    </tr>

                    <tr>
                        {this.renderSquares(7)}
                    </tr>

                    <tr>
                        {this.renderSquares(8)}
                    </tr>

                    <tr>
                        {this.renderSquares(9)}
                    </tr>

                    <tr>
                        {this.renderSquares(10)}
                    </tr>

                    <tr>
                        {this.renderSquares(11)}
                    </tr>
                </table>
            </div>
        )
    }

}

export default Game;