import * as CryptoJS from "crypto-js";

//클래스
class Block {
    public index: number;
    public hash: string;
    public previousHash: string;
    public data: string;
    public timestamp: number;

    //블록 해쉬 생성
    static calculateBlockHash = (
        index:number
        , previousHash:string
        , timestamp: number
        , data:string
    ) : string => 
        CryptoJS.SHA256(index + previousHash + timestamp + data).toString();
    
    //블록 유효성 검사 메서드
    static validateStructure = (aBlock : Block) : boolean => 
        typeof aBlock.index === "number" 
        && typeof aBlock.hash === "string" 
        && typeof aBlock.previousHash === "string"
        && typeof aBlock.timestamp === "number"
        && typeof aBlock.data === "string";

    constructor(
        index: number
        , hash: string
        , previousHash: string
        , data: string
        , timestamp: number
    ) {
        this.index = index;
        this.hash = hash;
        this.previousHash = previousHash;
        this.data = data;
        this.timestamp = timestamp;
    }
}

//최초의 블록
const genesisBlock:Block = new Block(0, "202020202020", "", "Hello", 123456);

//블록 배열
let blockchain: [Block] = [genesisBlock]

//마지막 블록
const getLatestBlock = (): Block => blockchain[blockchain.length - 1];

//새로운 시간
const getNewTimeStamp = (): number => Math.round(new Date().getTime() / 1000);

//새로운 블록 생성
const createNewBlock = (data:string) : Block => {
    const previousBlock : Block = getLatestBlock();
    const newIndex : number = previousBlock.index + 1;
    const newTimestamp : number = getNewTimeStamp();
    const newHash : string = Block.calculateBlockHash(newIndex, previousBlock.hash, newTimestamp, data);
    const newBlock : Block = new Block(newIndex, newHash, previousBlock.hash, data, newTimestamp);
    addBlock(newBlock);
    return newBlock;
}

//배열에 블록 추가
const addBlock = (candidateBlock : Block) : void => {
    if(isBlockValid(candidateBlock, getLatestBlock())) {
        blockchain.push(candidateBlock);
    }
}

//생성한 해쉬값 변수에 담기
const getHashforBlock = (aBlock : Block) : string => Block.calculateBlockHash(aBlock.index, aBlock.previousHash, aBlock.timestamp, aBlock.data);

//블록 유효성 검사
const isBlockValid = (candidateBlock : Block, previousBlock : Block) : boolean => {
    if(!Block.validateStructure(candidateBlock)) {
        return false;
    } else if(previousBlock.index + 1 !== candidateBlock.index) {
        return false;
    } else if(previousBlock.hash !== candidateBlock.previousHash) {
        return false;
    } else if(getHashforBlock(candidateBlock) !== candidateBlock.hash) {
        return false;
    } else {
        return true;
    }
};


//블록 생성
createNewBlock("second block");
createNewBlock("third block");
createNewBlock("fourth block");

console.log(blockchain);

export{};