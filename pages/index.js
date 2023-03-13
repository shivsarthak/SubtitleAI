import Head from 'next/head'
import Image from 'next/image'
import Balancer from "react-wrap-balancer";
import { useState } from 'react';
import styles from '../styles/Home.module.css'
import { Upload } from "lucide-react";
import { motion } from "framer-motion";
import Layout from '../components/layout';
import { useUploadModal } from '../components/upload-modal';
import { FADE_DOWN_ANIMATION_VARIANTS } from '../constants/animations';
import Howto from '../components/how-to';


export default function Home() {
  const [videoFile, setVideoFile] = useState(null);

  const handleVideoFileChange = (event) => {
    setVideoFile(event.target.files[0]);
  };

  const handleSubtitleFileChange = (event) => {
    setSubtitleFile(event.target.files[0]);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    // Perform subtitle file generation logic here using videoFile and subtitleFile
  };
  const { UploadModal, setShowUploadModal } = useUploadModal();

  return (
    <Layout>
      <UploadModal />
      <motion.div
        className="max-w-screen xl:px-0"
        initial="hidden"
        whileInView="show"
        animate="show"
        viewport={{ once: true }}
        variants={{
          hidden: {},
          show: {
            transition: {
              staggerChildren: 0.15,
            },
          },
        }}
      >
        <div className='max-w-2xl mx-auto'>
          <motion.h1
            className="bg-gradient-to-br from-black to-stone-500 bg-clip-text text-center font-display text-6xl font-bold tracking-[-0.02em] text-transparent drop-shadow-sm md:text-7xl md:leading-[5rem]"
            variants={FADE_DOWN_ANIMATION_VARIANTS}
          >
            <Balancer>Generate Subtitles for any video using AI</Balancer>
          </motion.h1>
          <motion.p
            className="mt-6 text-center text-gray-500 md:text-xl"
            variants={FADE_DOWN_ANIMATION_VARIANTS}
          >
            <Balancer ratio={0.6}>
              Effortlessly add accurate subtitles to your videos with our AI-powered subtitle generator.
            </Balancer>
          </motion.p>
          <motion.div variants={FADE_DOWN_ANIMATION_VARIANTS} className="-mb-4">
            <button
              className="group mx-auto mt-6 flex max-w-fit items-center justify-center space-x-2 rounded-full border border-black bg-black px-5 py-2 text-sm text-white transition-colors hover:bg-white hover:text-black"
              onClick={() => setShowUploadModal(true)}

            >
              <Upload className="h-5 w-5 text-white group-hover:text-black" />
              <p>Upload video file</p>
            </button>
            <p className="mt-2 text-center text-sm text-gray-500">
              {/* Write subtitle here  */}
            </p>

          </motion.div>
        </div>
        <Howto />
      </motion.div>



    </Layout>
  );
};
