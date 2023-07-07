type AvatarProps = {
  img: string;
  className: string;
};

const Avatar = ({ img, className }: AvatarProps) => {
  return (
    <div className={`rounded-full overflow-hidden ${className}`}>
      <img
        src={img}
        alt="/"
        className="w-full h-full object-cover object-center"
      />
    </div>
  );
};

export default Avatar;
