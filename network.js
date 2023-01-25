function Matrix() {
}
Matrix.prototype.transpose = function(matrix){
  let matrixT =[];
  matrix[0].forEach((arr,rankIndex)=>{
    //列
    let rank = [];
    matrix.forEach((rowArr)=>{
      //行
      rank.push(rowArr[rankIndex]);
    });
    matrixT.push(rank);
  });
  return matrixT;
}
Matrix.prototype.dot = function(arr1,arr2){
    //数组对应元素相乘
    let value = 0;
    arr1.forEach((v,index)=>{
      value += arr1[index] * arr2[index];
    });
    return value;
}
Matrix.prototype.multiply = function(matrixA,matrixB){
    //计算新矩阵大小
    let A_ranklength = matrixA[0].length;
    let B_rowlength = matrixB.length;
    if(A_ranklength==B_rowlength){
      let matrix = [];
      let matrixBT = this.transpose(matrixB);
      //对矩阵A遍历 行
      matrixA.forEach((A_rowArr,A_rowIndex)=>{
        //创建行数组 row
        let rowArr = [];
        matrixBT.forEach((B_rowArr,B_rowIndex)=>{
          //计算
          let value =this.dot(A_rowArr,B_rowArr);
          rowArr.push(value);
        });
        matrix.push(rowArr);
    });
      return matrix;
    }else console.console.log('matrix不满足要求');
  };
let matrix = new Matrix();

//console.log('mu0:'+matrix.multiply(matrixA,matrixB)[0]);
//console.log('mu1:'+matrix.multiply(matrixA,matrixB)[1]);

function NeuralNetwork() {
  this.errors = [];
  this.learnRate = 0.1;
  this.network = [];
  this.netWeights = [];
  this.activite = function(actiFunc,out){
    switch (actiFunc) {
      case "Relu":
        return this.Relu(out);
        break;
      case "sigmoid":
        return this.sigmoid(out);
        break;
      case "LeakyRelu":
        return this.LeakyRelu(out);
        break;
      case 'None':
        return out;
        break;
    }
  }
  //激活函数sigmoid
  this.sigmoid = function(input) {
    var output = 1 / (1 + Math.pow(Math.E, -input));
    return output;
  };

  //激活函数Relu
  this.Relu = function(input) {
    return Math.max(0, input);
  };

  //激活函数LeakyRelu
  this.LeakyRelu = function(input) {
    return Math.max(0.05*input,input);
  };

  //loss函数
  this.loss = function(target, input) {
    var d = target - input;
    var output = (1 / 2) * Math.pow(d, 2);
    return output;
  };

  //求导
  this.derivation = function(actiFunc,out) {
    //console.console.log('activitionFunction:'+this.activitionFunction);
    switch (actiFunc) {
      case "Relu":
        if(out>0){
          return 1;
        }
        else{
          return 0;
        }
        break;
      case "sigmoid":
        return out * (1 - out);
        break;
      case "LeakyRelu":
        if (out > 0) {
          return 1;
        }
        else {
          return 0.05;
        }
        break;
      case 'None':
        return out;
        break;
    }
  };

}


NeuralNetwork.prototype.addLayerWeights = function(layer,nextLayer){
  let layerWeights = [];
  for (let i=0;i<layer;i++) {
    let cellWeights = [];
    for (let c=0; c < nextLayer; c++) {
      let weight = Math.random()-0.5;
      cellWeights.push(weight);
    }
    layerWeights.push(cellWeights);
  }
  this.netWeights.push(layerWeights);
};

NeuralNetwork.prototype.addLayer = function(cell_number,activition_function){
  let layer = new Object();
  let cells = [];
  for(let i = 0;i<cell_number+1;i++){
    let cell = {
      error:0,
      intput:0,
      output:0
    };
    if(i==cell_number){
      //偏置细胞
      cell.output = 1;
    }
    cells.push(cell);
  }
  layer.cells = cells;
  layer.activition_function = activition_function;
  this.network.push(layer);
};


NeuralNetwork.prototype.linkCells =function(){
  this.network.forEach((layer,layerIndex,net)=>{
    //console.console.log('net[layerIndex+1]:'+net[layerIndex+1]);
    if(net[layerIndex+1]){
      let cells = layer.cells;
      let nextCells = net[layerIndex+1].cells;
      //console.console.log('nextCells:'+nextCells);
      //nextCells.length-1最后一个是偏置细胞
      this.addLayerWeights(cells.length,nextCells.length-1);
    }
  });
};

NeuralNetwork.prototype.intput = function(intputs){
  //输入
  intputs.forEach((value, index, arr) =>{
    //console.console.log(this.network[index])
    //console.console.log('aaaaa'+this.network[0].cells[index].output)
    this.network[0].cells[index].output = intputs[index];
  });
};

NeuralNetwork.prototype.feedForward = function(Intputs){
  
  this.intput(Intputs);
  //前向传播
  this.network.forEach((layer,layerIndex,net)=>{
    //从第二层
    if(layerIndex!=0){
      let cells = layer.cells;
      let actiFunc = layer.activition_function;
      let lastLayerCells = net[layerIndex-1].cells;
      //console.console.log(lastLayerCells);
      cells.forEach((cell,cellIndex)=>{
        if(cellIndex != cells.length-1){
          let intputs = [];
          let weights = [];
          lastLayerCells.forEach((cell_,cell_Index)=>{
            //console.console.log('cell_.out:'+cell_.output);
            let weight =this.netWeights[layerIndex-1][cell_Index][cellIndex];

            //以out作为下一层的输入
            intputs.push(cell_.output);
          
            weights.push(weight);
          /*
          //如果是这个层的最后一个细胞 多返回一个偏置权重
          if(cell_Index == (lastLayerCells.length-1) ){
            weights.push(this.netWeights[layerIndex-1][cell_Index+1][cellIndex])
          }
          */
          });
          //console.console.log('intputs:'+intputs);
          //console.console.log('weights:'+weights);
  
          //计算加权平均和
          let out = matrix.dot(intputs,weights);
          //console.console.log('加权平均和:'+out);
          //
          cell.intput = out;
          
          //激活函数处理
          cell.output = this.activite(actiFunc,out);
        }
      });
    }
  });
  
  //返回最后一层的out值 (数组)
  let Output = [];
  let lastLayerCells = this.network[this.network.length - 1].cells;
  
  lastLayerCells.forEach((cell, index, arr) => {
    if(index != lastLayerCells.length-1){
      Output.push(cell.output);
    }
  });
  return Output;
  
};

NeuralNetwork.prototype.sampleErrorRate = function(intputs,targets){
  //console.log('intputs'+intputs);
  //console.log('targets'+targets);
  if(intputs.length==targets.length){
    let error = 0;
    intputs.forEach((value,index,arr)=>{
      //console.log('index'+index);
      error += this.loss(intputs[index],targets[index]);
      //console.log('error'+error);
    });
    return error;
  }
};

NeuralNetwork.prototype.averageErrorRate = function(err){
  this.errors.push(err);
  if(this.errors.length>this.maxError){
    this.errors.shift();
  }
  return this.errors.reduce((tem,item)=>tem+item)/this.errors.length;
};

NeuralNetwork.prototype.backForward = function(targets){
  //计算偏导
  //从最后一层开始遍历到第二层
  for(let layerIndex =this.network.length-1;layerIndex>=1;layerIndex--){
    //遍历当前层的细胞
    let layerCells = this.network[layerIndex].cells;
    let actiFunc = this.network[layerIndex].activition_function;
    let lastLayerCells = this.network[layerIndex-1].cells;
    
    layerCells.forEach((cell,cellIndex)=>{
      if(cellIndex != layerCells.length-1){
        //console.log(cell.error === this.network[layerIndex].cells[cellIndex].error);
        
        //上一个梯度
        let gradient;
        
        if (layerIndex == this.network.length - 1) {
          gradient = (cell.output - targets[cellIndex]);
            //console.log("最后一层:"+layerIndex+"细胞:"+cellIndex+"gradient:"+gradient);
            //console.log("cell.output"+cell.output);
            //console.log("targets[cellIndex]"+targets[cellIndex]);
        }else{
          gradient = cell.error;
          //console.log("层:"+layerIndex+"细胞:"+cellIndex+"gradient:"+gradient);
        }
        //求导
        let d = this.derivation(actiFunc,cell.output);
        //存
        cell.error = gradient * d;
        //前传
        if(layerIndex!= 1){
        lastLayerCells.forEach((cell_,cell_Index)=>{
          let w = this.netWeights[layerIndex-1][cell_Index][cellIndex];
          
          //console.log('gradient'+gradient);
          cell_.error += gradient * d *w;
          //console.log('d'+d);
          //console.log('w'+w);
   
         //console.log('cell_.error'+cell_.error);
        
        });
        }
      }
    });
  }
  //更新权重和偏置
  this.network.forEach((layer,layerIndex)=>{
    if(layerIndex !=0){
      let layerCells = this.network[layerIndex].cells;
      let lastLayerCells = this.network[layerIndex-1].cells;
      layerCells.forEach((cell,cellIndex)=>{
        let error = cell.error;
        lastLayerCells.forEach((cell_,cell_Index)=>{
          let weights = this.netWeights[layerIndex-1][cell_Index];
          let pd = error * cell_.output;
          weights[cellIndex] -= pd;
        });
        //初始化
        cell.error = 0;
      });
    }
  });
};

NeuralNetwork.prototype.train = function(intputs,targets){
  //前向传播
  let outputs = this.feedForward(intputs);
  //计算当前样本loss
  let loss = this.sampleErrorRate(outputs,targets);
  //计算样本平均cost
  let cost = this.averageErrorRate(loss);
  //console.log('cost'+cost);
  //反向传播
  this.backForward(targets);
};

NeuralNetwork.prototype.copyNetwork = function(targetNetwork){
  //复制网络权重
  let targetWeights = targetNetwork.netWeights;
  //console.log(targetWeights);
  targetWeights.forEach((layerW,layerIndexW)=>{
    	let layerCells = this.network[layerIndexW].cells;
        let nextLayerCells = this.network[layerIndexW+1].cells;
       //console.log("layerIndexW"+layerIndexW);
    	layerCells.forEach((cell,cellIndex)=>{
      	nextLayerCells.forEach((nextCell,nextCellIndex)=>{
             //偏置细胞不链接
             if(nextCellIndex != nextLayerCells.length -1){
         		this.netWeights[layerIndexW][cellIndex][nextCellIndex] = targetWeights[layerIndexW][cellIndex][nextCellIndex]; 
         	}
          });
        });
  });
  
};

export default NeuralNetwork;


