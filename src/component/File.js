import React, { useState ,useEffect } from "react";
import './file.css';
import logo from './logo.png';
import { ReactComponent as TextIcon } from './svg/text.svg';
import { ReactComponent as ImageIcon } from './svg/image.svg';
import { ReactComponent as PdfIcon } from './svg/pdf.svg';
import { ReactComponent as WordIcon } from './svg/word.svg';
import { useNavigate, Link } from 'react-router-dom';
import Workspace from './pages/Workspace';

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
  const [currentEditingId, setCurrentEditingId] = useState(null); // 현재 수정 중인 파일 ID
  const [newName, setNewName] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const tags = ['빨', '주', '노', '초', '파', '남', '보'];
  const tagColors = {
    '빨': 'red',
    '주': 'orange',
    '노': 'yellow',
    '초': 'green',
    '파': 'blue',
    '남': 'navy',
    '보': 'purple',
  };

  const [selectedWorkspace, setSelectedWorkspace] = useState(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);


  


  const onDragStart = (e, tag) => {
    e.dataTransfer.setData('tag', tag);
  };

  // 파일 항목에 대한 드랍 이벤트 핸들러
const onDropa = (e, fileInfo) => {
    e.preventDefault();
    const tag = e.dataTransfer.getData('tag');

    // 파일에 드랍한 경우 fileInfo가 undefined이므로 분기 처리가 필요합니다.
    if (fileInfo) {
        // 파일 정보에 태그를 추가하는 로직
        const updatedSaveInfo = saveInfo.map(file => {
            if (file.id === fileInfo.id) {
                return { ...file, tags: [...(file.tags || []), tag] };
            }
            return file;
        });
        setSaveInfo(updatedSaveInfo);
    } else {
        // 기존의 파일을 드랍했을 때의 처리 로직
        const files = e.dataTransfer.files;
        confirmAndSetFileInfo(files);
    }
};


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
    
    //const res = await getSearchRequest(userInput);
    // getSearchRequest는 백엔에서 준 API를 받아오는 함수를 따로
    // 함수로 정의했고 거기서 꺼내옴
    //setSearchLists(res.rows);

    // 더미 데이터에서 사용자 입력과 일치하는 이름을 가진 파일 찾기
    const searchResults = saveInfo.filter(file => file.name.toLowerCase().includes(userInput));
    // 검색 결과 상태 업데이트
    setSearchLists(searchResults);
  };

  const handleFileUpload = async (files) => {
    //파일의 업로드 기능
    const formData = new FormData();
    formData.append('file', files[0]);
  
    try {
      const response = await fetch('/api/workspace/{workspaceId}/folders/{folderId}', {
        method: 'GET',
        body: formData,
      });
  
      if (!response.ok) {
        throw new Error('파일 업로드 실패');
      }
  
      // 업로드 후 파일 목록을 갱신합니다.
      fetchFiles();
    } catch (error) {
      console.error('파일 업로드 중 오류 발생:', error);
    }
  };

  const fetchFiles = async () => {
    //파일 목록을 불러오는 코드
    try {
      const response = await fetch('/api/workspace/{workspaceId}/folders/{folderId}');
      const data = await response.json();
      setSaveInfo(data);
    } catch (error) {
      console.error('파일 목록을 불러오는 중 오류 발생:', error);
    }
  };

  const handleDoubleClick = async (fileId) => {
    //파일을 더블클릭하여 실행하는 코드
    try {
      const response = await fetch(`/api/workspace/{workspaceId}/folders/{folderId}}`);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = blob.name;
      document.body.appendChild(a);
      a.click();
      a.remove();
    } catch (error) {
      console.error('파일을 여는 중 오류 발생:', error);
    }
  };
   
  const handleSave = () => {
    if (window.confirm('파일을 저장하시겠습니까?'))
      {
         
        setSaveInfo([...saveInfo,...uploadedInfo]);
        //handleFileUpload();
        setShowPreview(false)
                   
      }
      
  };
  

  

  useEffect(() => {
    // 더미 데이터
    const dummyFiles = [
      { id: 1, name: "문서1.txt", size: "1MB", type: "text/plain " },
      { id: 2, name: "문서2.txt", size: "2MB", type: "text/plain" },
      { id: 3, name: "보고서.pdf", size: "3MB", type: "application/pdf" },
      { id: 4, name: "보고서2.pdf", size: "3MB", type: "application/pdf" },
      { id: 5, name: "보고서3.pdf", size: "3MB", type: 'image/png' },
      { id: 6, name: "보고서4.pdf", size: "3MB", type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' },
      { id: 7, name: "보고서5.pdf", size: "3MB", type: "application/pdf" },
      { id: 8, name: "보고서6.pdf", size: "3MB", type: 'image/png' },
      { id: 9, name: "보고서7.pdf", size: "3MB", type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' }
    ];
   

      setSaveInfo(dummyFiles); // 더미 파일 정보로 상태 업데이트
  }, []);

  const workspaces = [
    { name: '윤형', id: 'yoonhyung'},
    { name: '근민', id: 'keunmin' },
 
  ];
  
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

  const filedelete = (fileName, fileSize) => {
    // saveInfo 배열에서 해당 파일을 제외한 새 배열을 생성
    const filteredFiles = saveInfo.filter(file => !(file.name === fileName && file.size === fileSize));
    // 업데이트된 배열로 saveInfo 상태를 설정
    setSaveInfo(filteredFiles);
  };


   const handleFileNameEdit = (id, newName) => {
    const updatedFiles = saveInfo.map(file => {
      if (file.id === id) {
        return { ...file, name: newName };
      }
      return file;
    });
    setSaveInfo(updatedFiles);
  };

 
  const openEditModal = (id) => {
    setIsEditing(true);
    setCurrentEditingId(id);
    const file = saveInfo.find(file => file.id === id);
    if (file) {
      setNewName(file.name);
    }
  };

  const closeEditModal = () => {
    setIsEditing(false);
    setNewName('');
  };

  const handleSubmit = () => {
    handleFileNameEdit(currentEditingId, newName);
    closeEditModal();
  };

  const WorkspacePopup = ({ workspaces, onSelect, onClose }) => {
    return (
      <div className="popup">
        <div className="popup-inner">
          <h2>Select a Workspace</h2>
          {workspaces.map((workspace) => (
            <h1 key={workspace.id} onClick={() => onSelect(workspace.id)}>
              {workspace.name}
            </h1>
          ))}
          <button onClick={onClose}>Close</button>
        </div>
      </div>
    );
  };

  const handleSelectWorkspace = (id) => {
    setSelectedWorkspace(id);
    setIsPopupOpen(false);
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      onClickSearchInput();
    }
  };
 
  return (

    <div className="app-container">
      <div className="left-panel">  
      
      <button onClick={() => setIsPopupOpen(true)}>Select Workspace</button>
      <Link to='/create-workspace'>워크스페이스 추가</Link>
      <img src={logo} alt="로고" className="logo" />
      <p>
          <input
            onChange={getSearchData}
            onKeyDown={handleKeyDown}
            type="text"
            placeholder="검색어를 입력하세요"
          
          />
          
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
          <div className="tags">
            {tags.map((tag, index) => (
              <div
                key={index}
                draggable
                onDragStart={(e) => onDragStart(e, tag)}
                style={{ width: '5px', height: '5px', margin: '4px', padding: '5px',   backgroundColor: tagColors[tag], display: 'inline-block', borderRadius: '50%'}}
              >
          </div>
        ))}
      </div>
      <button className="user-logout-btn" onClick={handleLogout}>
                로그아웃   
           </button>
      </div>

      <div className="right-panel">
      {selectedWorkspace ? (
          <Workspace id={selectedWorkspace} />
        ) : 
        isPopupOpen && (
        <WorkspacePopup
          workspaces={workspaces}
          onSelect={handleSelectWorkspace}
          onClose={() => setIsPopupOpen(false)}
        />
      )}
      
      <div className="capacity-display">
        사용 가능한 용량: {storage.total}GB 중 {storage.used}GB 사용 중
      </div>
        <div class="grid-container1">
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
        <div className="grid-container2">
        {saveInfo.map((fileInfo, index) => (
          <div className="grid-item" key={index} onDoubleClick={() => handleDoubleClick(fileInfo._id)}  onDrop={(e) => onDropa(e, fileInfo)} onDragOver={(e) => e.preventDefault()}>
            <div className="item-container">
              <FileIcon type={fileInfo.type} />
              <div>{fileInfo.name}</div>
              <div>{fileInfo.tags}</div>
            </div>
            <div className="btn-container">
            <button className="file-delete" onClick={() => filedelete(fileInfo.name, fileInfo.size)}>
              삭제
            </button>
           <button className="file-name" onClick={() => openEditModal(fileInfo.id)}>수정</button>
           </div>
          </div>
        ))}

        {isEditing && (
        <div className="popup-container">
          <input type="text" value={newName} className="popup-input" onChange={(e) => setNewName(e.target.value)} />
          <button className="popup-button" onClick={handleSubmit} disabled={newName.length === 0}>제출</button>
        </div>
      )}
      </div>

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

