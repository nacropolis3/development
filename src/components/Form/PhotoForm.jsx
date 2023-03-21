import React, { useEffect, useState } from "react";
import styled from "styled-components";
import EclipseButton from "../Button/EclipseButton";

export default function PhotoForm(props) {
  const [selected, setSelected] = useState(null);
  const [selectedMiniature, setSelectedMiniature] = useState(null);
  const [dataTemp, setDataTemp] = useState({
    title: "",
    imageView: false,
    detail: false,
    wrapValue: "home",
    iframeDrag: false,
    // title_header: "Crear producto",
  });
  const [files, setFiles] = useState([]);

  const handleChangeFile = (e, file) => {
    const { value } = e.target;
    const indexFile = files.indexOf(file);

    const newArray = [];

    files.forEach((file, index) => {
      if (index === indexFile) {
        newArray.push({
          ...file,
          description: value,
        });
      } else {
        newArray.push(file);
      }
    });

    setFiles(newArray);
  };

  const deleteFile = (file) => {
    let index = files.indexOf(file);
    const elementNewObj = [
      ...files.slice(0, index),
      ...files.slice((index += 1), files.length),
    ];
    if (file === selectedMiniature) {
      setSelectedMiniature(null);
    }
    setFiles(elementNewObj);
  };
  const handleFile = (e) => {
    const filesTemp = Object.values(e.target.files);
    const filesNew = [];
    filesTemp.forEach((file) => {
      if (file.type.split("/")[0] === "image") {
        if (files.length <= 4) {
          filesNew.push({ file: file });
          setFiles(filesNew.concat(files));
        }
      }
    });
    // addFile(filesNewObj);
    setDataTemp({ ...dataTemp, iframeDrag: false, imageView: true });
  };

  useEffect(() => {
    props.setFiles(files);
  }, [files]);

  return (
    <div className="relative">
      <ContainerForm
        onDragOver={() => setDataTemp({ ...dataTemp, iframeDrag: true })}
        className={`${
          files.length < 1
            ? "border dark:border-neutral-700 rounded-md p-2"
            : ""
        } scrollbar-thin dark:scrollbar-thumb-[#737475bb] dark:scrollbar-track-[#318191a] overflow-y-auto `}
      >
        {files.length > 0 ? (
          <div className="flex flex-col gap-2 w-full">
            {files.map((file, index) => (
              <div className="flex w-full gap-2" key={index}>
                <div className="border relative w-[150px] min-w-[150px] h-[150px] rounded-lg overflow-hidden">
                  <img
                    className="w-full object-cover h-full "
                    src={URL.createObjectURL(file.file)}
                  />
                  <div className="absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]">
                    <EclipseButton
                      onClick={() => deleteFile(file)}
                      type="default"
                      size="medium"
                      icon={
                        <svg
                          className=" dark:text-zinc-300"
                          viewBox="0 0 24 24"
                          fill="none"
                        >
                          <path
                            d="M4.70711 3.29289C4.31658 2.90237 3.68342 2.90237 3.29289 3.29289C2.90237 3.68342 2.90237 4.31658 3.29289 4.70711L10.5858 12L3.29289 19.2929C2.90237 19.6834 2.90237 20.3166 3.29289 20.7071C3.68342 21.0976 4.31658 21.0976 4.70711 20.7071L12 13.4142L19.2929 20.7071C19.6834 21.0976 20.3166 21.0976 20.7071 20.7071C21.0976 20.3166 21.0976 19.6834 20.7071 19.2929L13.4142 12L20.7071 4.70711C21.0976 4.31658 21.0976 3.68342 20.7071 3.29289C20.3166 2.90237 19.6834 2.90237 19.2929 3.29289L12 10.5858L4.70711 3.29289Z"
                            fill="currentColor"
                            style={{
                              strokeWidth: "0",
                            }}
                          ></path>
                        </svg>
                      }
                    />
                  </div>
                </div>
                <div className="w-full">
                  <textarea
                    value={file.description}
                    onChange={(e) => handleChangeFile(e, file)}
                    placeholder="Description..."
                    className="border resize-none p-2 text-xs outline-none border-neutral-400 rounded-md h-full w-full"
                  ></textarea>
                </div>
              </div>
            ))}
            {files.length <= 4 && (
              <div className="border relative w-[70px] min-w-[70px] h-[70px] rounded-lg overflow-hidden">
                <ItemImage className="rounded-md cursor-pointer border border-blue-500 hover:bg-blue-200 relative flex items-center justify-center ">
                  <div className="image-con w-full flex items-center justify-center h-full">
                    <div className="hover:dark:bg-neutral-800 absolute w-full h-full flex items-center justify-center rounded-md">
                      <span className="text-blue-600 font-semibold text-xs">
                        Agregar
                      </span>
                      <input
                        className="absolute top-0 opacity-0 left-0 text-[0] w-full h-full cursor-pointer"
                        onChange={handleFile}
                        multiple
                        type="file"
                        accept="image/*,image/heif,image/heic"
                        autoComplete="off"
                      />
                    </div>
                  </div>
                </ItemImage>
              </div>
            )}
          </div>
        ) : (
          <FormInput className="">
            <input
              id="fmr_uid"
              className="absolute top-0 left-0 text-[0] opacity-0 w-full h-full cursor-pointer"
              onChange={handleFile}
              multiple
              accept="image/*,image/heif,image/heic,video/*,video/mp4,video/x-m4v,video/x-matroska,.mkv"
              type="file"
              autoComplete="off"
            />
            <ContainerInput className="wf8uhuff8 flex items-center justify-center rounded-md dark:bg-neutral-700 bg-neutral-200">
              <div className="content">
                <div className=" mx-auto w-[40px] rounded-full h-[40px] bg-neutral-700 p-[7px] text-neutral-50 flex items-center">
                  <svg
                    width="25px"
                    height="25px"
                    fill="currentColor"
                    x="0px"
                    y="0px"
                    viewBox="0 0 391.377 391.377"
                  >
                    <g>
                      <path
                        d="M387.456,91.78c-3.739-6.178-9.648-10.526-16.638-12.245L162.499,28.298c-2.106-0.519-4.27-0.781-6.433-0.781
		c-12.471,0-23.259,8.45-26.235,20.551l-6.271,25.498L19.405,106.616c-13.918,4.416-22.089,18.982-18.602,33.163l50.1,203.696
		c1.733,7.046,6.122,12.958,12.358,16.647c4.182,2.474,8.837,3.737,13.564,3.737c2.324,0,4.667-0.306,6.977-0.923l160.436-42.907
		l63.58,15.638c2.106,0.519,4.271,0.781,6.435,0.781c12.471,0,23.259-8.451,26.233-20.55l50.102-203.698
		C392.307,105.211,391.195,97.959,387.456,91.78z M79.246,333.102L30.421,134.595l84.742-26.89L79.732,251.763
		c-1.721,6.99-0.608,14.243,3.131,20.422c3.738,6.178,9.646,10.527,16.639,12.247l84.249,20.721L79.246,333.102z M335.706,209.731
		l-28.492-43.88c-3.492-5.379-9.295-8.59-15.523-8.59c-4.229,0-8.271,1.438-11.69,4.157l-60.656,48.255
		c-1.82,1.449-4.045,2.215-6.434,2.215c-3.137,0-6.058-1.336-8.014-3.663l-22.981-27.35c-4.406-5.242-11.464-8.372-18.879-8.372
		c-3.661,0-7.207,0.803-10.254,2.32l-26.477,13.193l31.942-129.871L360.74,107.95L335.706,209.731z"
                      />
                      <path
                        d="M207.988,145.842c2.114,0.52,4.282,0.783,6.442,0.783c12.406,0,23.143-8.423,26.109-20.483
		c3.542-14.405-5.295-29.008-19.7-32.552c-2.114-0.52-4.282-0.783-6.442-0.783c-12.406,0-23.143,8.423-26.109,20.483
		C184.746,127.695,193.583,142.298,207.988,145.842z"
                      />
                    </g>
                  </svg>
                </div>
                <div className="flex flex-col">
                  <p className="text-neutral-800 dark:text-neutral-100 font-semibold text-sm">
                    Agregar fotos e imagenes
                  </p>
                  <span className="text-neutral-500 text-xs">
                    o arrastra y suelta
                  </span>
                </div>
              </div>
            </ContainerInput>
          </FormInput>
        )}
        {selected && (
          <div className="bg-[#0f1011] fixed top-0 left-0 h-[100vh] w-full z-[100] backdrop-blur-md">
            <div
              onClick={() => setSelected(null)}
              style={{
                backgroundImage: `url(${URL.createObjectURL(selected)})`,
                zIndex: "-1",
              }}
              className="absolute top-0 left-0 w-full bg-no-repeat bg-cover h-full blur-[300px] opacity-80"
            ></div>
            <div className="absolute  top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]">
              <div className=" p-5 z-[106]  flex items-center justify-center">
                <img
                  className="rounded-md  max-h-[90vh]"
                  src={URL.createObjectURL(selected)}
                />
              </div>
            </div>
            <div className="absolute top-5 right-5">
              <EclipseButton
                onClick={() => setSelected(null)}
                type="default medium"
                icon={
                  <svg viewBox="0 0 24 24" fill="none">
                    <path
                      d="M4.70711 3.29289C4.31658 2.90237 3.68342 2.90237 3.29289 3.29289C2.90237 3.68342 2.90237 4.31658 3.29289 4.70711L10.5858 12L3.29289 19.2929C2.90237 19.6834 2.90237 20.3166 3.29289 20.7071C3.68342 21.0976 4.31658 21.0976 4.70711 20.7071L12 13.4142L19.2929 20.7071C19.6834 21.0976 20.3166 21.0976 20.7071 20.7071C21.0976 20.3166 21.0976 19.6834 20.7071 19.2929L13.4142 12L20.7071 4.70711C21.0976 4.31658 21.0976 3.68342 20.7071 3.29289C20.3166 2.90237 19.6834 2.90237 19.2929 3.29289L12 10.5858L4.70711 3.29289Z"
                      fill="currentColor"
                      style={{
                        strokeWidth: "0",
                      }}
                    ></path>
                  </svg>
                }
              />
            </div>
          </div>
        )}
        {dataTemp.iframeDrag && (
          <div
            onDragLeave={() => setDataTemp({ ...dataTemp, iframeDrag: false })}
            className="absolute top-0 left-0 w-full h-full bg-neutral-800 border border-blue-600 rounded-lg"
          >
            <input
              className="absolute top-0 left-0 text-[0] opacity-0 w-full h-full cursor-pointer"
              onChange={handleFile}
              multiple
              accept="image/*,image/heif,image/heic"
              type="file"
              autoComplete="off"
            />
            <div className="h-full w-full flex items-center justify-center">
              <div className="">
                <div className="justify-center flex ">
                  <div className="w-[40px] h-[40px] bg-blue-700 text-blue-50 p-2 rounded-full">
                    <svg
                      fill="currentColor"
                      x="0px"
                      y="0px"
                      viewBox="0 0 391.377 391.377"
                    >
                      <g>
                        <path
                          d="M387.456,91.78c-3.739-6.178-9.648-10.526-16.638-12.245L162.499,28.298c-2.106-0.519-4.27-0.781-6.433-0.781
		c-12.471,0-23.259,8.45-26.235,20.551l-6.271,25.498L19.405,106.616c-13.918,4.416-22.089,18.982-18.602,33.163l50.1,203.696
		c1.733,7.046,6.122,12.958,12.358,16.647c4.182,2.474,8.837,3.737,13.564,3.737c2.324,0,4.667-0.306,6.977-0.923l160.436-42.907
		l63.58,15.638c2.106,0.519,4.271,0.781,6.435,0.781c12.471,0,23.259-8.451,26.233-20.55l50.102-203.698
		C392.307,105.211,391.195,97.959,387.456,91.78z M79.246,333.102L30.421,134.595l84.742-26.89L79.732,251.763
		c-1.721,6.99-0.608,14.243,3.131,20.422c3.738,6.178,9.646,10.527,16.639,12.247l84.249,20.721L79.246,333.102z M335.706,209.731
		l-28.492-43.88c-3.492-5.379-9.295-8.59-15.523-8.59c-4.229,0-8.271,1.438-11.69,4.157l-60.656,48.255
		c-1.82,1.449-4.045,2.215-6.434,2.215c-3.137,0-6.058-1.336-8.014-3.663l-22.981-27.35c-4.406-5.242-11.464-8.372-18.879-8.372
		c-3.661,0-7.207,0.803-10.254,2.32l-26.477,13.193l31.942-129.871L360.74,107.95L335.706,209.731z"
                        />
                        <path
                          d="M207.988,145.842c2.114,0.52,4.282,0.783,6.442,0.783c12.406,0,23.143-8.423,26.109-20.483
		c3.542-14.405-5.295-29.008-19.7-32.552c-2.114-0.52-4.282-0.783-6.442-0.783c-12.406,0-23.143,8.423-26.109,20.483
		C184.746,127.695,193.583,142.298,207.988,145.842z"
                        />
                      </g>
                    </svg>
                  </div>
                </div>
                <span className="font-semibold text-blue-500 text-xs">
                  Suelta los archivos aquí
                </span>
              </div>
            </div>
          </div>
        )}
      </ContainerForm>
    </div>
  );
}

const ContainerForm = styled.div`
  max-height: 300px;
`;
const FormInput = styled.div`
  position: relative;
  overflow: hidden;
  /* input:hover ~ .wf8uhuff8 {
    background-color: #1d1c1c;
  } */
`;
const ContainerInput = styled.div`
  height: 230px;
  transition: 0.1s;
  text-align: center;
  .icon {
    background-color: #cccccc;
    width: 35px;
    height: 35px;
    border-radius: 50%;
    padding: 5px;
    margin: 0 auto;
    svg {
      width: 100%;
      height: 100%;
    }
    svg {
      margin: 0 auto;
    }
  }
  .title {
    p {
      color: #222222;
      font-size: 16px;
      font-weight: 500;
    }
    span {
      font-size: 12px;
      display: block;
      line-height: 10px;
      color: #555555;
    }
  }
`;

const ContainerImages = styled.div`
  grid-gap: 0.5rem;
  grid-template-columns: repeat(5, 1fr);
  .miniature {
    grid-column: 1 / span 3;
    grid-row: 1 / span 3;
  }
`;
const ItemImage = styled.div`
  .image-con {
    &:after {
      content: "";
      display: block;
      padding-bottom: 100%;
      width: 100%;
    }
  }
  .pan-abolsute {
    opacity: 0;
    transition: 0.1s;
  }
  &:hover {
    .pan-abolsute {
      opacity: 1;
    }
  }
`;
