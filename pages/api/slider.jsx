import React from 'react';
import Slider from 'react-slick';
import { Text } from '@mantine/core';

const TextSlider = () => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2000,
  };

  return (
    <Slider {...settings}>
      <div>
        <Text
          size={20}
          fw={600}
          mt={15}
          pl={5}
          style={{
            border: '1px solid rgba(0, 0, 0, 0.2)',
            borderRadius: '4px',
            padding: '30px',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
          }}
        >
          Hik@ri's Innへようこそ！🎉 <br />
          お手伝いが必要な場合は、お好きな言語で気軽にお尋ねください!
        </Text>
      </div>
      <div>
        <Text
          size={20}
          fw={600}
          mt={15}
          pl={5}
          style={{
            border: '1px solid rgba(0, 0, 0, 0.2)',
            borderRadius: '4px',
            padding: '30px',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
          }}
        >
          Welcome to Hik@ri's Inn! 🎉 <br />
          If you need any assistance, please don't hesitate to ask in any
          language you prefer!
        </Text>
      </div>
      <div>
        <Text
          size={20}
          fw={600}
          mt={15}
          pl={5}
          style={{
            border: '1px solid rgba(0, 0, 0, 0.2)',
            borderRadius: '4px',
            padding: '30px',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
          }}
        >
          ¡Bienvenido a Hik@ri's Inn! 🎉
          <br /> Si necesita ayuda, no dude en preguntar en el idioma que
          prefiera!
        </Text>
      </div>
    </Slider>
  );
};

export default TextSlider;
