/*
-Các bước làm
+ Xây dựng các bộ từ đồng nghĩa, và chuyển đổi chúng sang dạng đặc tả.
+ Duyệt câu và loại bỏ các từ dư thừa, không có nghĩa khi chuyển sang đặc tả.
+ **** Ghép từng từ thành các cặp từ để phân loại
    - Ta có mỗi đối tượng thì có  Đối tượng|Loại|Tên|phân loại
+ Đối với các BT chứng minh thì sẽ có Biểu thức  --> Xử lý lấy đc BT
+ Xây dựng các mẫu câu cho GT và KL,  để sử dụng string match
+ Xây dựng file: Mẫu câu giá trị và MauCauTu --> tìm hết chuỗi
    file: MauCauHinh: thì xét sau 
    thứ tự in ra: MauCauHinh > MauCauTu > MauCauGiaTri

Quy ước:
 + dùng dấu - thay chữ 'và', ',' để kiểm tra quan hệ giữ các phần tử
 + Các kí hiệu về hình đoạn thẳng đều In Hoa
 + 1 ký tự in Hoa => Góc || Điểm || Đường tròn || Bán kính => xét thêm tiền tố trước nó
 + 2 ký tự in Hoa => Cạnh || Tia 
 + 3 ký tự in Hoa => Góc || Tia || Tam Giác
 + 4 ký tự in Hoa => Tứ Giác ( Hình Chữ Nhật | Hình Vuông | Hình Thoi | Hình Bình Hành)


 + Check các Cụm ký hiệu toán hình --> Đếm số lượng trong đó
    - Độ dài 1 -> Điểm
    - Độ dài 2 -> Đoạn
    - Độ dài 3 -> Tam giác || Góc ==> Xét tiền tố trước nó để xác định thuộc kiểu nào
    - Độ dài 4 -> Tứ Giác ==> Xét tiền tố trước nó để xác định thuộc kiểu nào (Hình vuông, Hình chữ nhật, hình hình hành, hình thang        )



    */







/*
Cho đoạn thẳng AK có độ dài là 9cm.
Cho điểm B thuộc đoạn AK,
C nằm giữa hai điểm A và B,
biết rằng AC = 4cm,
BC = 1cm
Tính đoạn AB và BK



Cho đoạn thẳng AK có độ dài là 9cm.
Cho điểm B thuộc đoạn AK,
Điểm M nằm giữa đoạn thẳng AB,
C nằm giữa hai điểm A và B,
biết rằng AC = 4cm,
BC = 1cm
Tính đoạn AB và BK


Cho góc XOY = 110, biết rằng
Tia OZ là tia phân giác của góc XOY,
Tia OP là tia phân giác của góc ZOY,
Tia Oz nằm giữa tia OP và Tia OX.
Tính các góc ZOY, ZOX,
POZ, POX, POY.   

cho tam giác ABC = tam giác HEK trong đó AB = 2 cm, góc B = 40, BC = 4 cm. Tính góc HEK, đoạn HE
*/



let DeBai = document.querySelector('.debai');
let GiaThiet = document.querySelector('.giathiet');
let KetLuan = document.querySelector('.ketkuan');
const btnKetQuan = document.querySelector('.thuchien');


// TODO: Khai báo và gán các data text 
let DSTuXoa = convertStrtoArray( readTextFile('data/TuXoa.txt'),';');
let QuyUocChung = XuLyQuyUoc('data/QuyUoc.txt');
console.log(QuyUocChung);

// Tạo các QUY ƯỚC CHUYỂN ĐỔI TỪ
function XuLyQuyUoc(pathStr){
    let DsQuyUoc;
    let QuyUoc = convertStrtoArray(readTextFile(pathStr),';');
    QuyUoc.pop();
    DsQuyUoc = QuyUoc.map(function(e){
        return convertStrtoArray(e,'>')
    })

    return DsQuyUoc;
}

function XuLyChuyenDoiQuyUoc(str, arr) {
    let tempStr, rexDeg;

    for(let i = 0; i < arr.length; i++){
        rexDeg = new RegExp(arr[i][0], 'g');
        if(tempStr){
            tempStr = tempStr.replace(rexDeg,arr[i][1]);
        } else {
            tempStr = str.replace(rexDeg,arr[i][1]);
        }
    
    }

    return tempStr.trim().replace(/\s+/g, ' ');
}

/* =================================
Sự kiện click thực hiện chương trình
====================================*/
btnKetQuan.addEventListener('click', function(e){
    e.preventDefault();

    // Xóa các ký hiệu 
    const debaiStr = XoaCacKyHieu(DeBai.value);
    //Chuyển đổi Quy ƯỚC
    const debaiStrQuyUoc = XuLyChuyenDoiQuyUoc(debaiStr, QuyUocChung);
    // Xóa các từ thừa
    const debaiStrXoaTuThua = XoaTuThua(debaiStrQuyUoc);
    
    console.log(debaiStr);
    console.log(debaiStrQuyUoc);
    console.log(debaiStrXoaTuThua);
    
   





// TODO: Xử lý nhận dạng tách thành 2 phần GIẢ THIẾT và KẾT LUẬN
    const {GiaThietTemp, KetLuanTemp} = TachGiathietKetLuan(debaiStrXoaTuThua);
    GiaThiet.value = GiaThietTemp;
    KetLuan.value = KetLuanTemp;
// TODO: Xử lý phần GIẢ THIẾT
    XuLyGiaThiet(GiaThietTemp);
// TODO: Xử lý phần KẾT LUẬN
    XuLyKetLuan(KetLuanTemp);

})





/* =================================
Xác định phần giả thuyết và kết luận dựa vào các từ đăc trưng và đồng nghĩa
====================================*/
function TachGiathietKetLuan(str){
    let strTemp;
    let strArr = convertStrtoArray(str.trim(),' ');
    console.log(strArr)
    let wordTach = convertStrtoArray(readTextFile('data/QuyUocTachGTKL.txt'), ';');
    let breakPoint, checkExit = false;

    for(let i= 0; i< wordTach.length; i++){

        for(let j = 0; j< strArr.length; j++){
            if(strArr[j] === wordTach[i]){
                breakPoint = j;
                checkExit = true;
                break;
            }
        }

        if(checkExit) break;
    }
    //console.log(breakPoint);
    strTemp = strArr.slice(breakPoint);
    return {
        'GiaThietTemp': strArr.slice(0,breakPoint).join(' '),
        'KetLuanTemp': strTemp.join(' ')
    }

}


/* ================================
    XỬ LÝ PHẦN GIẢ THIẾT 
==============(======================*/
function XuLyGiaThiet(giathiet) {
    const DSTuGT = convertStrtoArray(giathiet, ' ');
    let a = 0, indexPhantuDaXuLy = [];
    let giathietText = '';
    // Tách các đoạn thẳng và giá trị của nó
    while(a < DSTuGT.length) {
        if(DSTuGT[a] === '='){
            if(DSTuGT[a-2] === 'góc'){
                giathietText += 'Góc(' + DSTuGT[a-1] +')'+ DSTuGT[a] + DSTuGT[a+1] + ';\n';
                // Gán các giá trị index các từ đã xử lý để giảm số phần tử trong mảng ban đầu
                indexPhantuDaXuLy.push(a-2);
                indexPhantuDaXuLy.push(a-1);
                indexPhantuDaXuLy.push(a);
                indexPhantuDaXuLy.push(a+1);
            }    
            else{
                giathietText += DSTuGT[a-1] + DSTuGT[a] + DSTuGT[a+1] + ';\n';
                indexPhantuDaXuLy.push(a-1);
                indexPhantuDaXuLy.push(a);
                indexPhantuDaXuLy.push(a+1);
            }
            
        } 
        
        a++; 
    }

    let DSTuConLai = removeArrbyIndex(DSTuGT, indexPhantuDaXuLy);
    console.log(giathiet);
    console.log(DSTuConLai);
    console.log(giathietText);


    let GOC = [], TAMGIAC = [], TUGIAC = [], indexItem = [];
    for(let i = 0; i < DSTuConLai.length; i++){
        if(isUpper(DSTuConLai[i]) && DSTuConLai[i].length === 3){
            if(DSTuConLai[i-1] === 'góc'){
                GOC.push('Góc('+ DSTuConLai[i] + ')');
                continue;
            } else {
                TAMGIAC.push(DSTuConLai[i]);
                indexItem.push(i);
                continue;
            }
        } 

        if(isUpper(DSTuConLai[i]) && DSTuConLai[i].length === 4){
            TUGIAC.push(DSTuConLai[i]);
            indexItem.push(i);
            continue;
         }
         
        }
        console.log(indexItem);
        let strCau = [], strCauItem = ' ';

        for(let i = 0; i < indexItem.length; i++){
            for(let j = 0; j <= indexItem[i]; j++){
                strCauItem += DSTuConLai[j] + ' ';
                DSTuConLai[j] = '';
            }
            strCau.push(strCauItem);
            strCauItem = ''
        }

        console.log(strCau);

        
        
        let strTuConLai = DSTuConLai.join(' ');
        
        GiaThiet.value = strCau.join(';') + ';' + giathietText;
    
}


/* ================================
    XỬ LÝ PHẦN KẾT LUẬN 
====================================*/
function XuLyKetLuan(strKetLuan) {
    let strKLTemp, regdexKl;
    let DOANTHANG = [], TAMGIAC = [], GOC = [], TUGIAC = [];
    let indexItem = []
    const QuyUocKetLuan = XuLyQuyUoc('data/QuyUocChoKetLuan.txt');
    // console.log(QuyUocKetLuan);
    // console.log(strKetLuan);


    for(let i = 0; i < QuyUocKetLuan.length; i++){
        regdexKl = new RegExp(QuyUocKetLuan[i][0],'g');
        if(strKLTemp){
            strKLTemp = strKLTemp.replace(regdexKl,QuyUocKetLuan[i][1]);
        } else {
            strKLTemp = strKetLuan.replace(regdexKl,QuyUocKetLuan[i][1]);
        }
    }
    // console.log(strKLTemp);
    const strKLTempArr = convertStrtoArray(strKLTemp.trim().replace(/\s+/g, ' '),' ');
    let checkGoc = strKLTemp.trim().replace(/\s+/g, ' ');
    console.log(strKLTempArr);
    for(let i = 0; i < strKLTempArr.length; i++){
        if(isUpper(strKLTempArr[i]) && strKLTempArr[i].length === 2){
            DOANTHANG.push(strKLTempArr[i]);
            continue;
        }

        if(isUpper(strKLTempArr[i]) && strKLTempArr[i].length === 3){
            if(strKLTempArr[i-1] === 'góc' || !checkGoc.includes('giác')){
                GOC.push('Góc('+ strKLTempArr[i] + ')');
                continue;
            } else {
                TAMGIAC.push(strKLTempArr[i]);
                indexItem.push(i);
                continue;
            }
        } 

        if(isUpper(strKLTempArr[i]) && strKLTempArr[i].length === 4){
            TUGIAC.push(strKLTempArr[i]);
            indexItem.push(i);

            continue;
         }
         
        }


    let strKL ='';
    
    if(TAMGIAC.length !== 0) {
        strKL += TAMGIAC.join(',');
    }
    if(TUGIAC.length !== 0) {
        strKL += (strKL !== '' ? ','+TUGIAC.join(','):TUGIAC.join(','));
    }
    if(GOC.length !== 0){
        strKL += (strKL !== '' ? ','+GOC.join(','):GOC.join(','));
    }
    if(DOANTHANG.length !== 0) {
        strKL += (strKL !== '' ? ','+DOANTHANG.join(','):DOANTHANG.join(','));
    }
    KetLuan.value = strKL+';';
    console.log(indexItem);
    let strKLTienTo = '';
    for(let a = 0; a < indexItem.length; a++){
        for(let j = 0; j < indexItem[a]; j++){
            strKLTienTo += strKLTempArr[j]+' ';
            strKLTempArr[j] = '';
            strKLTempArr[indexItem[a]] = '';
        }
    }
    
    
    // console.log((GOC.length == 0 ? 'rỗng' :'ko rỗng'));
    KetLuan.value = strKLTienTo + strKL + ';';
    // console.log(strKLTienTo + strKL);
    console.log(TUGIAC);
    
    /*
    tiền tố chu vi và diện tích chính xác 
    Chu vi diện tích tam giác ABC
    
    
    */
}









/* ================================
   HÀM XỬ LÝ 
====================================*/

///Chuyển đổi string sang mảng
function convertStrtoArray(str, character){
    return str.split(character);
}

//CHuyển chuỗi thành 1 kiểu định dạng
function convertStrtoUpperCase(str){
    return str.toUpperCase();
}
function convertStrtoLowerCase(str){
    return str.toLowerCase();
}


/* =================================
    Xóa các khoảng trống dư thừa
    Xóa các ký tự đặc biệt
====================================*/
function XoaCacKyHieu(str){
    return str.replace(/[\n,.;)(:\/?]|cm|km|mm|cm2|mm2|deg|hm|dam|dm|mm|m2|km2/g,' ').trim().replace(/\s+/g, ' ');
    // str.replace(/\n/g,'').replace(/[,.]/g,' ').replace(/cm/g,'');
}


// Kiểm tra  là toàn chữ là in hoa
function isUpper(str) {
    return !/[a-z]/.test(str) && /[A-Z]/.test(str);
}


//TODO: Xóa các từ đã xử lý thông qua chỉ số
function removeArrbyIndex(arr,arrIndex){

    for(let i = 0; i < arrIndex.length; i++){
        arr[arrIndex[i]] = '';
    }

    arr.join('');
    return convertStrtoArray(arr.join(' ').trim().replace(/\s+/g, ' '), ' ');    
}




//Xóa các từ thông dụng
function XoaTuThua(str){
    let redexWord, tempStr;
    DSTuXoa.pop();
    for(let i= 0; i< DSTuXoa.length; i++){
        redexWord =  new RegExp(DSTuXoa[i],'g');
        if(tempStr){
            tempStr = tempStr.replace(redexWord,' ');
        } else {
            tempStr = str.replace(redexWord,' ');
        }
    }

    return tempStr.trim().replace(/\s+/g, ' ');
}

// TODO:  đọc file data text
function readTextFile(file)
{
    var rawFile = new XMLHttpRequest();
    var allText;
    rawFile.open("GET", file, false);
    rawFile.onreadystatechange = function ()
    {
        if(rawFile.readyState === 4)
        {
            if(rawFile.status === 200 || rawFile.status == 0)
            {
                allText = rawFile.responseText;
                // alert(allText);
            }
        }
    }
    rawFile.send(null);

    return allText;
}




console.log(strTuConLai);
    let testStr  = strTuConLai.match(/[Tt]ia [A-Z][A-z] là tia phân giác của [Gg]óc [A-Z][A-Z][A-Z]/g);
    let t = convertStrtoArray(testStr[0], ' ');
    let c = [];
    console.log(t);
    for(let i = 0; i < t.length; i++){
        if(isUpper(t[i])) c.push(t[i]); 
    }
    console.log(c);
    let g = 'Tia 0 là phân giác của Góc(1)';
    for(let j = 0; j < c.length; j++){
        g = g.replace(j,c[j]);
    }
    console.log(g);