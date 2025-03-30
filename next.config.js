/** @type {import('next').NextConfig} */

// import {i18n} from './next1i.config'
const nextConfig = {
  reactStrictMode: false,
  swcMinify: false,
  appDir: true,
  eslint: { ignoreDuringBuilds: true },
  env: {
    CRYPTO_SECRET_KEY: "gjfdkhslbreif847593rewfdkjbcm34woebkdjcnx43oihefdkcnx",
    COOKIE_PASSWORD: "ierfkgj439802vfckdh5438909endck",
    AWS_BUCKET: "appraisalfile",
    AWS_REGION: "us-east-1",
    AUTO_RELOADING_DELAY:180000,
    BACKEND_DOMAIN:
      "http://appraisalland-dev.ca-central-1.elasticbeanstalk.com/api",
    BACKEND_DOMAIN2:
      "http://appraisalland-dev.ca-central-1.elasticbeanstalk.com/api",
  },
  images: {
    domains: [
      // "res.cloudinary.com",
      "appraisalfile.s3.us-east-1.amazonaws.com",
      "appraisallandfiless.s3.amazonaws.com",
      "avatars.githubusercontent.com",
      "lh3.googleusercontent.com",
      "https://www.paypalobjects.com/webstatic/mktg/logo/",
      "www.paypalobjects.com",
    ],
  },
};

module.exports = nextConfig;
