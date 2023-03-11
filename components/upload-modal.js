import {
    useState,
    Dispatch,
    SetStateAction,
    useCallback,
    useMemo,
    ChangeEvent,
} from "react";
import { UploadCloud } from "lucide-react";
import { motion } from "framer-motion";
import { useRouter } from "next/router";
import Modal from "./modal";
import { API_ENDPOINT } from "../constants/endpoint";


const LoadingDots = ({ color = "#000" }) => {
    return (
        <span>
            <span style={{ backgroundColor: color }} />
            <span style={{ backgroundColor: color }} />
            <span style={{ backgroundColor: color }} />
        </span>
    );
};
const FADE_IN_ANIMATION_SETTINGS = {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    transition: { duration: 0.2 },
};

const FADE_DOWN_ANIMATION_VARIANTS = {
    hidden: { opacity: 0, y: -10 },
    show: { opacity: 1, y: 0, transition: { type: "spring" } },
};

const FADE_UP_ANIMATION_VARIANTS = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0, transition: { type: "spring" } },
};
const UploadModal = ({
    showUploadModal,
    setShowUploadModal,
}) => {
    const [video, setVideo] = useState();
    const [preview, setPreview] = useState();
    const [fileSizeTooBig, setFileSizeTooBig] = useState(false);

    const [dragActive, setDragActive] = useState(false);

    const onChangePicture = useCallback(
        (event) => {
            setFileSizeTooBig(false);
            const file = event.currentTarget.files[0];
            if (file) {
                if (file.size / 1024 / 1024 > 75) {
                    setFileSizeTooBig(true);
                } else {
                    setVideo(file);
                    var reader = new FileReader();
                    reader.onload = (event) => {
                        const result = event.target.result;
                        setPreview(result);
                    }
                    reader.readAsDataURL(file);
                }
            }
        },
        [setVideo],
    );

    const [saving, setSaving] = useState(false);

    const saveDisabled = useMemo(() => {
        return !video || saving;
    }, [video, saving]);

    return (
        <Modal showModal={showUploadModal} setShowModal={setShowUploadModal}>
            <div className="w-full overflow-hidden shadow-xl md:max-w-md md:rounded-2xl md:border md:border-gray-200">
                <div className="flex flex-col items-center justify-center space-y-3 border-b border-gray-200 bg-white px-4 py-6 pt-8 text-center md:px-16">

                    <h3 className="font-display text-2xl font-bold">Upload Video</h3>
                    <p className="text-sm text-gray-500">
                        Your video will be automatically deleted after 24 hours.
                    </p>
                </div>

                <form
                    className="grid gap-6 bg-gray-50 px-4 py-8 md:px-16"
                    onSubmit={

                        async (e) => {
                            e.preventDefault();
                            setSaving(true);
                            const formData = new FormData();
                            formData.append('video', video);
                            formData.append('mode', 'fast');
                            fetch(API_ENDPOINT + "/upload_video",
                                {
                                    method: "POST",
                                    body: formData
                                }).then(async (res) => {
                                    if (res.ok) {
                                        const d = await res.json();
                                        window.location.href = '/task/' + d['id'];
                                    } else {
                                        setSaving(false);
                                        alert("Something went wrong. Please try again later.");
                                    }
                                });
                        }

                    }
                >
                    <div>
                        <div className="flex items-center justify-between">
                            <p className="block text-sm font-medium text-gray-700">Video</p>
                            {fileSizeTooBig && (
                                <p className="text-sm text-red-500">
                                    File size too big (max 75MB)
                                </p>
                            )}
                        </div>
                        <label
                            htmlFor="video-upload"
                            className="group relative mt-2 flex h-72 cursor-pointer flex-col items-center justify-center rounded-md border border-gray-300 bg-white shadow-sm transition-all hover:bg-gray-50"
                        >
                            <div
                                className="absolute z-[5] h-full w-full rounded-md"
                                onDragOver={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    setDragActive(true);
                                }}
                                onDragEnter={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    setDragActive(true);
                                }}
                                onDragLeave={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    setDragActive(false);
                                }}
                                onDrop={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    setDragActive(false);
                                    setFileSizeTooBig(false);
                                    const file = e.dataTransfer.files && e.dataTransfer.files[0];
                                    if (file) {
                                        if (file.size / 1024 / 1024 > 75) {
                                            setFileSizeTooBig(true);
                                        } else {
                                            setVideo(file)
                                        }
                                    }
                                }}
                            />
                            <div
                                className={`${dragActive ? "border-2 border-black" : ""
                                    } absolute z-[3] flex h-full w-full flex-col items-center justify-center rounded-md px-10 transition-all ${video
                                        ? "bg-white/80 opacity-0 hover:opacity-100 hover:backdrop-blur-md"
                                        : "bg-white opacity-100 hover:bg-gray-50"
                                    }`}
                            >
                                <UploadCloud
                                    className={`${dragActive ? "scale-110" : "scale-100"
                                        } h-7 w-7 text-gray-500 transition-all duration-75 group-hover:scale-110 group-active:scale-95`}
                                />
                                <p className="mt-2 text-center text-sm text-gray-500">
                                    Drag and drop or click to upload.
                                </p>
                                <p className="mt-2 text-center text-sm text-gray-500">
                                    Recommended: File must be less than 75MB in size and not longer than 10 minutes
                                </p>
                                <span className="sr-only">Video upload</span>
                            </div>
                            {video && (
                                <video

                                    src={preview}
                                    alt="Preview"
                                    className="h-full w-full rounded-md object-cover"
                                />
                            )}
                        </label>
                        <div className="mt-1 flex rounded-md shadow-sm">
                            <input
                                id="video-upload"
                                name="video"
                                type="file"
                                accept="video/*"
                                className="sr-only"
                                onChange={onChangePicture}
                            />
                        </div>
                    </div>


                    <button
                        disabled={saveDisabled}
                        className={`${saveDisabled
                            ? "cursor-not-allowed border-gray-200 bg-gray-100 text-gray-400"
                            : "border-black bg-black text-white hover:bg-white hover:text-black"
                            } flex h-10 w-full items-center justify-center rounded-md border text-sm transition-all focus:outline-none`}
                    >
                        {saving ? (
                            <LoadingDots color="#808080" />
                        ) : (
                            <p className="text-sm">Confirm upload</p>
                        )}
                    </button>
                </form>
            </div>
        </Modal>
    );
};

export function useUploadModal() {
    const [showUploadModal, setShowUploadModal] = useState(false);

    const UploadModalCallback = useCallback(() => {
        return (
            <UploadModal
                showUploadModal={showUploadModal}
                setShowUploadModal={setShowUploadModal}
            />
        );
    }, [showUploadModal, setShowUploadModal]);

    return useMemo(
        () => ({ setShowUploadModal, UploadModal: UploadModalCallback }),
        [setShowUploadModal, UploadModalCallback],
    );
}