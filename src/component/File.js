import React, { useState ,useEffect } from "react";
import ReactDOM from 'react-dom'; 
import './file.css';
import logo from './logo.png';
import { ReactComponent as TextIcon } from './svg/text.svg';
import { ReactComponent as ImageIcon } from './svg/image.svg';
import { ReactComponent as PdfIcon } from './svg/pdf.svg';
import { ReactComponent as WordIcon } from './svg/word.svg';
import { Route, useNavigate } from 'react-router-dom';


const FileIcon = ({ type }) => {
  switch(type) {
    case 'application/pdf':
      return <PdfIcon width="50" height="50" />;
    case 'image/png':
      return <ImageIcon width="50" height="50" />;
    case 'text/plain':
      return <TextIcon  width="50" height="50"  />;
    case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
      return <WordIcon width="50" height="50" />;
    default:
      return <TextIcon width="50" height="50" />;
  }
};

const Logo = () => (
  <svg className="icon" x="0px" y="0px" viewBox="0 0 24 24">
    <path fill="transparent" d="M0,0h24v24H0V0z"/>
    <path fill="#000" d="M20.5,5.2l-1.4-1.7C18.9,3.2,18.5,3,18,3H6C5.5,3,5.1,3.2,4.8,3.5L3.5,5.2C3.2,5.6,3,6,3,6.5V19  c0,1.1,0.9,2,2,2h14c1.1,0,2-0.9,2-2V6.5C21,6,20.8,5.6,20.5,5.2z M12,17.5L6.5,12H10v-2h4v2h3.5L12,17.5z M5.1,5l0.8-1h12l0.9,1  H5.1z"/>
  </svg>
);

const File = () => {
 
  const [isActive, setActive] = useState(false);
  const [uploadedInfo, setUploadedInfo] = useState([]);
  const [showPreview, setShowPreview] = useState(false);
  const [saveInfo, setSaveInfo] = useState([]);
  const [userInput, setUserInput] = useState('');
  const [searchLists, setSearchLists] = useState([]);
  const [storage, setStorage] = useState({ total: 0, used: 0 });

  const navigate = useNavigate();

  const handleLogout = () => {
        	// 로그아웃 처리 로직을 구현합니다.
    
        	sessionStorage.removeItem("token");
        	sessionStorage.removeItem("email");
        	navigate("/");
      	};

  useEffect(() => {
    // API 호출하여 용량 정보 가져오기
    fetch('')
      .then(response => {
        if (!response.ok) {
          throw new Error("HTTP error " + response.status);
        }
        return response.json();
      })
      .then(data => {
        setStorage(data);
      })
      .catch(error => {
        console.error("용량 정보를 가져오는 데 실패했습니다.", error);
      });
  }, []);

  const getSearchData = (e) => {
    setUserInput(e.target.value.toLowerCase());
  };

  const onClickSearchInput = async (e) => {
    e.preventDefault();
    //const res = await getSearchRequest(userInput);
    // getSearchRequest는 백엔에서 준 API를 받아오는 함수를 따로
    // 함수로 정의했고 거기서 꺼내옴
    //setSearchLists(res.rows);

    // 더미 데이터에서 사용자 입력과 일치하는 이름을 가진 파일 찾기
    const searchResults = saveInfo.filter(file => file.name.toLowerCase().includes(userInput));
    // 검색 결과 상태 업데이트
    setSearchLists(searchResults);
  };
  
  
  const handleSave = () => {
    if (window.confirm('파일을 저장하시겠습니까?'))
      {
         
        setSaveInfo([...saveInfo,...uploadedInfo]);
        // const response = await fetch("백 주소");
        // if (response.ok) {
        //   const files = await response.json();
        //   // 여기서 files를 화면에 표시하는 로직을 구현합니다.
        //   console.log(files);
        // }
         // const confirmAndSetFileInfo = async (files) => {
        //   const formData = new FormData();
        //   const contentsData = {
        //   }
        //   const fileData = inputRef.current.file.files;
                  
        //   for(let i = 0; i < fileData.length; i++) {
        //     formData.append("file", fileData[i]);
        //   }
          
        //   formData.append("contentsData", new Blob([JSON.stringify(contentsData)], { type: "application/json" }));
        // };
                   
      }
      
  };
  

  

  useEffect(() => {
    // 더미 데이터
    const dummyFiles = [
      { name: "문서1.txt", size: "1MB", type: "text/plain " },
      { name: "문서2.txt", size: "2MB", type: "text/plain" },
      { name: "보고서.pdf", size: "3MB", type: "application/pdf" },
      { name: "보고서3.pdf", size: "3MB", type: "application/pdf" },
      { name: "보고서3.pdf", size: "3MB", type: 'image/png' },
      { name: "보고서3.pdf", size: "3MB", type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' },
      { name: "보고서3.pdf", size: "3MB", type: "application/pdf" },
      { name: "보고서3.pdf", size: "3MB", type: 'image/png' },
      { name: "보고서3.pdf", size: "3MB", type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' }
    ];
   

      setSaveInfo(dummyFiles); // 더미 파일 정보로 상태 업데이트
  }, []);


  // useEffect(() => {
  //   // 컴포넌트가 마운트될 때 데이터베이스에서 파일 정보를 가져옵니다.
  //   const fetchFiles = async () => {
  //     try {
  //       const response = await fetch('데이터베이스에서 파일 정보를 가져오는 API의 URL');
  //       if (response.ok) {
  //         const files = await response.json();
  //         setUploadedInfo(files); // 가져온 파일 정보로 상태 업데이트
  //       } else {
  //         // 오류 처리
  //         console.error('서버로부터 파일 정보를 가져오는 데 실패했습니다.');
  //       }
  //     } catch (error) {
  //       // 오류 처리
  //       console.error('파일 정보를 가져오는 중 예외가 발생했습니다.', error);
  //     }
  //   };

  //   fetchFiles();
  // }, []); 

  
  const handleDragStart = () => setActive(true);
  const handleDragEnd = () => setActive(false);
  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const confirmAndSetFileInfo = (files) => {
    // 사용자가 '확인'을 클릭하면 파일 정보 저장   
      const filesInfo = Array.from(files).map(file => {
        const { name, size: byteSize, type } = file;
        const size = (byteSize / (1024 * 1024)).toFixed(2) + 'MB';
        return { name, size, type };
      });
      setUploadedInfo(filesInfo);
      
      setShowPreview(true); 
    
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setActive(false);

    const files = event.dataTransfer.files;
    confirmAndSetFileInfo(files);
    
  };


  return (
    
    <div className="app-container">
	
      <div className="left-panel">
      <h1>workspace name</h1>
      <img src={logo} alt="로고" className="logo" />
      <p>
         <input onChange={getSearchData} type="text" 
           placeholder="검색어를 입력하세요" />
           <button
              onClick={onClickSearchInput}
                disabled={userInput.length === 0}
                // 인풋값이 없으면 검색 버튼이 작동하지 않도록 설정했다.
            > 검색 
          </button>
          {searchLists.map((fileInfo, index) => (
            <div key={index}>
              <p>{fileInfo.name} ({fileInfo.size} {fileInfo.type})</p>
            </div>
          ))}
      </p>
        <label className="file-button">
          <span>파일 추가</span>
          <input
            type="file"
            className="file"
            onChange={(e) => confirmAndSetFileInfo(e.target.files)}
          />
        </label>
          <button className="user-logout-btn" onClick={handleLogout}>
          		로그아웃	
        	</button>
    
       
      </div>

      <div className="right-panel">
      <div className="capacity-display">
        사용 가능한 용량: {storage.total}GB 중 {storage.used}GB 사용 중
      </div>
        <div class="grid-container">
        {saveInfo.length === 0 ? (
        <label
          className={`preview${isActive ? ' active' : ''}`}
          onDragEnter={handleDragStart}
          onDragOver={handleDragOver}
          onDragLeave={handleDragEnd}
          onDrop={handleDrop}
        >
          
          <Logo />
          <p className="preview_msg">클릭 혹은 파일을 이곳에 드롭하세요.</p>
          <p className="preview_desc">파일당 최대 3MB</p>
        </label>
      ) : (
      <>
        {saveInfo.map((fileInfo, index) => (
          <div className="grid-item" key={index}>
            <FileIcon type={fileInfo.type} />
            <div>{fileInfo.name}</div>
          </div>
        ))}
        <label
          className={`preview${isActive ? ' active' : ''} transparent-drop-zone`}
          onDragEnter={handleDragStart}
          onDragOver={handleDragOver}
          onDragLeave={handleDragEnd}
          onDrop={handleDrop}
        >
         
        </label>
      </>
      )}
      </div>
     </div>

     {showPreview && (
        <div className="preview-popup">
          <h2>File Preview</h2>
          
          {uploadedInfo.map((file, index) => (
            <div key={index}>
              <p>{file.name} ({file.size} {file.type})</p>
            </div>
          ))}
          
          <button onClick={() => setShowPreview(false)}>Close</button>
          {<button onClick={handleSave}>저장하기</button>}
        </div>
      )}
    
    </div>

    
  );
};


export default File;


