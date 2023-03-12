
import { motion } from "framer-motion";
import { FADE_DOWN_ANIMATION_VARIANTS } from "../constants/animations";


export default function Howto() {
    return <motion.div
        variants={FADE_DOWN_ANIMATION_VARIANTS}
    >
        <div className=" w-screen flex flex-col md:flex-row pt-8 gap-12 justify-center items-center md:items-start">
            <div className=" md:w-1/4 w-4/5  flex flex-col justify-center items-center p-4 border bg-white  rounded-xl">
                <p className=" text-center text-zinc-800 font-bold md:text-xl pb-1">1. Upload Your Video File</p>
                <p className="mt-1 text-center text-sm text-gray-500">
                    The first step to generate subtitles for your video is to upload the video file to our website.
                    You can simply drag and drop your video file or browse your computer to select the video file you
                    want to add subtitles to.
                </p>
                <img src="/media.svg" className="p-4 h-44 md:h-60 object-contain" />

            </div>
            <div className="  md:w-1/4 w-4/5  flex flex-col justify-center items-center p-4 border bg-white  rounded-xl">
                <p className=" text-center text-zinc-800 font-bold md:text-xl pb-1">2. Auto Transcribe</p>
                <p className="mt-1 text-center text-sm text-gray-500">
                    Our website will automatically transcribe the audio from your video using advanced AI algorithms.
                    Within a few minutes, you will have a complete text transcript that will be used to create subtitles for your video.

                </p>
                <img src="/transcribe.svg" className="p-4 h-44 md:h-60 object-contain" />
            </div>
            <div className="  md:w-1/4 w-4/5 flex flex-col justify-center items-center p-4 border bg-white  rounded-xl">
                <p className=" text-center text-zinc-800 font-bold md:text-xl pb-1">3. Download Your Subtitle File</p>
                <p className="mt-1 text-center text-sm text-gray-500">
                    Once the audio transcription is complete, you can download the subtitle file in SRT format.
                    The SRT file will contain the text transcript with timecodes that indicate when each subtitle
                    should appear and disappear in your video. </p>
                <img src="/download.svg" className=" p-4 h-44 md:h-60  object-contain" />
            </div>
        </div>
    </motion.div>
}