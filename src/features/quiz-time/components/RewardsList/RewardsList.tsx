import React, { useState } from 'react';
import { 
  List, Typography, Card, Tag, Button, Empty, Spin, 
  Tabs, Badge, Popconfirm, Grid, message
} from 'antd';
import { 
  GiftOutlined, 
  CheckCircleOutlined, 
  CalendarOutlined, 
  FilterOutlined,
  CopyOutlined
} from '@ant-design/icons';
import { Reward } from '../../types';
import styles from './RewardsList.module.css';

const { Title, Text, Paragraph } = Typography;
const { TabPane } = Tabs;
const { useBreakpoint } = Grid;

export interface RewardsListProps {
  rewards: Reward[];
  isLoading?: boolean;
  onRedeemReward?: (rewardId: string) => Promise<void>;
  onViewQuizResult?: (quizResultId: string) => void;
}

/**
 * RewardsList component
 * Displays a list of earned rewards and allows for redemption
 */
const RewardsList: React.FC<RewardsListProps> = ({
  rewards,
  isLoading = false,
  onRedeemReward,
  onViewQuizResult
}) => {
  const screens = useBreakpoint();
  const [activeTab, setActiveTab] = useState<string>('all');
  const [redeeming, setRedeeming] = useState<Record<string, boolean>>({});
  
  // Handle reward redemption
  const handleRedeem = async (rewardId: string) => {
    if (!onRedeemReward) return;
    
    setRedeeming(prev => ({ ...prev, [rewardId]: true }));
    try {
      await onRedeemReward(rewardId);
      message.success('Reward redeemed successfully!');
    } catch (error) {
      message.error('Failed to redeem reward. Please try again.');
    } finally {
      setRedeeming(prev => ({ ...prev, [rewardId]: false }));
    }
  };
  
  // Handle copying redemption code to clipboard
  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code)
      .then(() => {
        message.success('Redemption code copied to clipboard!');
      })
      .catch(() => {
        message.error('Failed to copy code. Please try manually.');
      });
  };
  
  // Filter rewards based on active tab
  const filteredRewards = rewards.filter(reward => {
    if (activeTab === 'all') return true;
    if (activeTab === 'available') return !reward.isRedeemed;
    if (activeTab === 'redeemed') return reward.isRedeemed;
    return true;
  });
  
  // Format date for expiry display
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };
  
  // Get type label with appropriate color
  const getTypeTag = (type: string) => {
    const typeColors = {
      discount: 'blue',
      coupon: 'gold',
      points: 'purple'
    };
    
    const typeLabels = {
      discount: 'Discount',
      coupon: 'Coupon',
      points: 'Points'
    };
    
    const color = typeColors[type as keyof typeof typeColors] || 'default';
    const label = typeLabels[type as keyof typeof typeLabels] || type;
    
    return <Tag color={color}>{label}</Tag>;
  };
  
  // Check if reward is expired
  const isExpired = (expiresAt: string): boolean => {
    return new Date(expiresAt) < new Date();
  };
  
  // Render reward card
  const renderRewardCard = (reward: Reward) => {
    const expired = isExpired(reward.expiresAt);
    const isRedeeming = redeeming[reward.id] || false;
    
    return (
      <Badge.Ribbon 
        text={reward.isRedeemed ? 'Redeemed' : expired ? 'Expired' : 'Available'} 
        color={reward.isRedeemed ? 'green' : expired ? 'red' : 'blue'}
      >
        <Card className={styles.rewardCard}>
          <div className={styles.rewardHeader}>
            {getTypeTag(reward.type)}
            <div className={styles.rewardValue}>
              {reward.type === 'discount' ? `${reward.value}%` : reward.value}
            </div>
          </div>
          
          <Title level={5} className={styles.rewardName}>{reward.name}</Title>
          <Paragraph className={styles.rewardDescription}>{reward.description}</Paragraph>
          
          <div className={styles.rewardMeta}>
            <div className={styles.expiryDate}>
              <CalendarOutlined /> Expires: {formatDate(reward.expiresAt)}
            </div>
            
            {reward.quizResultId && (
              <Button 
                type="link" 
                size="small" 
                onClick={() => onViewQuizResult && onViewQuizResult(reward.quizResultId ?? '')}
              >
                View Quiz
              </Button>
            )}
          </div>
          
          <div className={styles.rewardActions}>
            {reward.isRedeemed ? (
              <>
                <Text type="success">
                  <CheckCircleOutlined /> Redeemed
                </Text>
                
                {reward.redemptionCode && (
                  <div className={styles.redemptionCode}>
                    <Text copyable={false} code className={styles.codeText}>
                      {reward.redemptionCode}
                    </Text>
                    <Button 
                      type="text" 
                      icon={<CopyOutlined />} 
                      size="small"
                      onClick={() => handleCopyCode(reward.redemptionCode || '')}
                      className={styles.copyButton}
                    />
                  </div>
                )}
              </>
            ) : expired ? (
              <Text type="danger">This reward has expired</Text>
            ) : (
              <Popconfirm
                title="Redeem this reward?"
                description="Once redeemed, this action cannot be undone."
                onConfirm={() => handleRedeem(reward.id)}
                okText="Redeem"
                cancelText="Cancel"
                placement="top"
                okButtonProps={{ loading: isRedeeming }}
              >
                <Button 
                  type="primary" 
                  loading={isRedeeming}
                  icon={<GiftOutlined />}
                >
                  Redeem Now
                </Button>
              </Popconfirm>
            )}
          </div>
        </Card>
      </Badge.Ribbon>
    );
  };
  
  return (
    <div className={styles.rewardsList}>
      <div className={styles.header}>
        <Title level={4}>
          <GiftOutlined /> Your Rewards
        </Title>
        
        <div className={styles.rewardsCount}>
          <Text>
            {filteredRewards.length} {activeTab !== 'all' ? activeTab : ''} rewards
          </Text>
        </div>
      </div>
      
      <Tabs 
        activeKey={activeTab} 
        onChange={setActiveTab}
        className={styles.tabs}
        tabBarExtraContent={screens.sm ? <FilterOutlined /> : null}
      >
        <TabPane tab="All Rewards" key="all" />
        <TabPane 
          tab={
            <Badge 
              count={rewards.filter(r => !r.isRedeemed).length} 
              overflowCount={99}
              style={{ backgroundColor: '#1890ff' }}
            >
              Available
            </Badge>
          } 
          key="available" 
        />
        <TabPane 
          tab={
            <Badge 
              count={rewards.filter(r => r.isRedeemed).length} 
              overflowCount={99}
              style={{ backgroundColor: '#52c41a' }}
            >
              Redeemed
            </Badge>
          } 
          key="redeemed" 
        />
      </Tabs>
      
      {isLoading ? (
        <div className={styles.loadingContainer}>
          <Spin size="large" />
          <Text>Loading rewards...</Text>
        </div>
      ) : filteredRewards.length === 0 ? (
        <Empty 
          description={
            activeTab === 'all' 
              ? "You haven't earned any rewards yet" 
              : activeTab === 'available'
                ? "You don't have any available rewards"
                : "You haven't redeemed any rewards yet"
          }
          image={Empty.PRESENTED_IMAGE_SIMPLE}
        />
      ) : (
        <div className={styles.rewardsGrid}>
          {filteredRewards.map(reward => (
            <div key={reward.id} className={styles.rewardItem}>
              {renderRewardCard(reward)}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RewardsList; 