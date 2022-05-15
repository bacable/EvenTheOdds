import { AIBoard } from "../models/aiBoard";

export class AI
{
    private static CalculateScore(boardState:AIBoard)
    {
        let humanScore = 0;
        boardState.humanScores.forEach(x => {
            if(x % 2 == 0) humanScore += 1;
        });
        let aiScore = 0;
        boardState.aiScores.forEach(x => {
            if(x % 2 == 0) aiScore += 1;
        });
        return aiScore - humanScore;
    }

    static Minimax(depth:number, maximizing:boolean, maxDepth:number, boardState:AIBoard)
    {
        if(depth >= maxDepth || boardState.nodes.length == 0)
        {
            return AI.CalculateScore(boardState);
        }

        if (maximizing)
        {
            let bestScore:number = -1000;
            let bestId:number = -1;
            let scores:number[] = [];

            boardState.nodes.forEach(x => {
                let child: AIBoard = {  aiScores: boardState.aiScores.slice(), 
                                        humanScores: boardState.humanScores.slice(),
                                        nodes: null
                                    };
                child.nodes = boardState.nodes.filter(y => y.id != x.id);
                child.aiScores[x.left] += 1;
                child.aiScores[x.right] += 1;

                /*
                if(depth == 0) {
                    console.log(JSON.stringify(child.nodes));
                }*/

                //console.log("depth: " + depth + ", scores: " + JSON.stringify(child.aiScores));

                let nodeValue = AI.Minimax(depth + 1, false, maxDepth, child);

                scores.push(nodeValue);

                if(nodeValue > bestScore) {
                    bestScore = nodeValue;
                    bestId = x.id;
                }
            });

            //console.log("Best: " + bestScore + " at depth " + depth + " of " + JSON.stringify(scores));

            if(depth == 0) {
                return bestId;
            } else {
                return bestScore;
            }
        }
        else
        {
            let worstScore:number = 1000;
            let worstId:number = -1;
            let scores:number[] = [];


            boardState.nodes.forEach(x => {
                let child: AIBoard = {  aiScores: boardState.aiScores.slice(), 
                                        humanScores: boardState.humanScores.slice(),
                                        nodes: null
                                    };
                child.nodes = boardState.nodes.filter(y => y.id != x.id);
                child.humanScores[x.left] += 1;
                child.humanScores[x.right] += 1;

                let nodeValue = AI.Minimax(depth + 1, true, maxDepth, child);

                scores.push(nodeValue);

                if(nodeValue < worstScore) {
                    worstScore = nodeValue;
                    worstId = x.id;
                }
            });

            //console.log("Worst: " + worstScore + " at depth " + depth + " of " + JSON.stringify(scores));


            return worstScore;
        }
    }
}