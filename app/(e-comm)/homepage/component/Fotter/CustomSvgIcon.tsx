import React from 'react';
import MapPinIcon from './MapPinIcon';
import FacebookIcon from './FacebookIcon';
import TwitterIcon from './TwitterIcon';
import LinkedinIcon from './LinkedinIcon';
import InstagramIcon from './InstagramIcon';
import MailIcon from './MailIcon';
import PhoneIcon from './PhoneIcon';
import WhatsappIcon from './WhatsappIcon';

const iconMap: Record<string, React.ComponentType<any>> = {
    'map-pin': MapPinIcon,
    'facebook': FacebookIcon,
    'twitter': TwitterIcon,
    'linkedin': LinkedinIcon,
    'instagram': InstagramIcon,
    'mail': MailIcon,
    'phone': PhoneIcon,
    'whatsapp': WhatsappIcon,
};

interface CustomSvgIconProps extends React.SVGProps<SVGSVGElement> {
    name: string;
}

const CustomSvgIcon: React.FC<CustomSvgIconProps> = ({ name, ...props }) => {
    const IconComponent = iconMap[name];
    if (!IconComponent) return null;
    return <IconComponent {...props} />;
};

export default CustomSvgIcon; 