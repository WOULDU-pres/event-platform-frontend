import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Typography, Card, Button, Tabs, Input, Empty, Spin, 
  Result, Tag, Row, Col, Divider, Badge, Popconfirm, message
} from 'antd';
import { 
  GiftOutlined, SearchOutlined, FilterOutlined, 
  HomeOutlined, TrophyOutlined, QuestionCircleOutlined
} from '@ant-design/icons';
import { useRewards } from '../../hooks';
import styles from './RewardsPage.module.css';

const { Title, Text, Paragraph } = Typography;
const { TabPane } = Tabs;

/**
 * RewardsPage component
 * Page for managing quiz rewards
 */
const RewardsPage: React.FC = () => {
  const navigate = useNavigate();
  const [filterType, setFilterType] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  
  const { 
    rewards, 
    isLoading, 
    error, 
    redeemReward,
    filterByRedemptionStatus,
    calculateTotalRewardValue,
    calculateRedeemedRewardValue,
    refreshRewards
  } = useRewards();
  
  // Fetch rewards on initial render
  useEffect(() => {
    refreshRewards();
  }, [refreshRewards]);
  
  // Filter rewards based on search term
  const filteredRewards = rewards.filter(reward => {
    if (searchTerm.trim() === '') return true;
    return (
      reward.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reward.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reward.type.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });
  
  // Handle reward redemption
  const handleRedeemReward = (rewardId: string) => {
    redeemReward(rewardId).then(() => {
      message.success('Reward redeemed successfully!');
    }).catch((err) => {
      message.error(`Failed to redeem reward: ${err.message}`);
    });
  };
  
  // Handle navigation to home
  const handleBackToHome = () => {
    navigate('/quiz-time');
  };
  
  // Handle navigation to quizzes
  const handleViewQuizzes = () => {
    navigate('/quiz-time');
  };
  
  // Calculate reward stats
  const totalRewards = rewards.length;
  const availableRewards = filterByRedemptionStatus ? filterByRedemptionStatus(false).length : 0;
  const redeemedRewards = filterByRedemptionStatus ? filterByRedemptionStatus(true).length : 0;
  const totalValue = calculateTotalRewardValue ? calculateTotalRewardValue() : 0;
  const redeemedValue = calculateRedeemedRewardValue ? calculateRedeemedRewardValue() : 0;
  
  // Helper function for filtering by redemption status
  const getFilteredByStatus = (isRedeemed: boolean) => {
    return filterByRedemptionStatus ? filterByRedemptionStatus(isRedeemed) : 
      rewards.filter(r => r.isRedeemed === isRedeemed);
  };
  
  // Render loading state
  if (isLoading) {
    return (
      <div className={styles.loadingContainer}>
        <Spin size="large" />
        <Text>Loading rewards...</Text>
      </div>
    );
  }
  
  // Render error state
  if (error) {
    return (
      <Result
        status="error"
        title="Failed to load rewards"
        subTitle={error}
        extra={[
          <Button type="primary" key="back" onClick={handleBackToHome}>
            Back to Quiz Time
          </Button>
        ]}
      />
    );
  }
  
  return (
    <div className={styles.rewardsPage}>
      <div className={styles.header}>
        <Title level={3}>
          <GiftOutlined /> My Rewards
        </Title>
        <Paragraph>
          View and manage all the rewards you've earned from quizzes.
        </Paragraph>
      </div>
      
      <div className={styles.statsContainer}>
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={8}>
            <Card className={styles.statCard}>
              <div className={styles.statValue}>{totalRewards}</div>
              <div className={styles.statLabel}>Total Rewards</div>
            </Card>
          </Col>
          <Col xs={24} sm={8}>
            <Card className={styles.statCard}>
              <div className={styles.statValue}>{availableRewards}</div>
              <div className={styles.statLabel}>Available</div>
            </Card>
          </Col>
          <Col xs={24} sm={8}>
            <Card className={styles.statCard}>
              <div className={styles.statValue}>{redeemedRewards}</div>
              <div className={styles.statLabel}>Redeemed</div>
            </Card>
          </Col>
        </Row>
        
        <Row gutter={[16, 16]} className={styles.valueStat}>
          <Col xs={24} sm={12}>
            <Card className={styles.statCard}>
              <div className={styles.statValue}>{totalValue}</div>
              <div className={styles.statLabel}>Total Value</div>
            </Card>
          </Col>
          <Col xs={24} sm={12}>
            <Card className={styles.statCard}>
              <div className={styles.statValue}>{redeemedValue}</div>
              <div className={styles.statLabel}>Redeemed Value</div>
            </Card>
          </Col>
        </Row>
      </div>
      
      <div className={styles.filtersContainer}>
        <Input
          placeholder="Search rewards"
          prefix={<SearchOutlined />}
          onChange={(e) => setSearchTerm(e.target.value)}
          allowClear
          className={styles.searchInput}
        />
        
        <div className={styles.rewardTypeFilters}>
          <Text className={styles.filterLabel}>
            <FilterOutlined /> Filter by Type:
          </Text>
          <div className={styles.filterButtons}>
            <Button 
              type={filterType === null ? 'primary' : 'default'}
              size="small"
              onClick={() => setFilterType(null)}
            >
              All
            </Button>
            {['discount', 'freebie', 'gift', 'experience'].map(type => (
              <Button
                key={type}
                type={filterType === type ? 'primary' : 'default'}
                size="small"
                onClick={() => setFilterType(type)}
              >
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </Button>
            ))}
          </div>
        </div>
      </div>
      
      <Tabs defaultActiveKey="all" className={styles.tabs}>
        <TabPane tab="All Rewards" key="all">
          {filteredRewards.length === 0 ? (
            <Empty
              description="No rewards found"
              image={Empty.PRESENTED_IMAGE_SIMPLE}
            />
          ) : (
            <div className={styles.rewardsGrid}>
              {filteredRewards
                .filter(reward => filterType === null || reward.type === filterType)
                .map(reward => (
                  <Card key={reward.id} className={styles.rewardCard}>
                    <div className={styles.rewardHeader}>
                      <Tag color={getTypeColor(reward.type)} className={styles.rewardType}>
                        {reward.type}
                      </Tag>
                      <Badge 
                        status={reward.isRedeemed ? 'default' : 'success'} 
                        text={reward.isRedeemed ? 'Redeemed' : 'Available'} 
                      />
                    </div>
                    
                    <Title level={5} className={styles.rewardTitle}>
                      {reward.name}
                    </Title>
                    
                    <Paragraph className={styles.rewardDescription}>
                      {reward.description}
                    </Paragraph>
                    
                    <div className={styles.rewardMeta}>
                      {reward.expiresAt && (
                        <Text type="secondary" className={styles.expiryDate}>
                          Expires: {formatDate(reward.expiresAt)}
                        </Text>
                      )}
                      
                      {reward.value && (
                        <Text className={styles.rewardValue}>
                          Value: {reward.value}
                        </Text>
                      )}
                    </div>
                    
                    <Divider />
                    
                    <div className={styles.rewardActions}>
                      {reward.isRedeemed ? (
                        <Text type="secondary">Redeemed on {formatDate(reward.expiresAt)}</Text>
                      ) : (
                        <Popconfirm
                          title="Redeem this reward?"
                          description="Are you sure you want to redeem this reward now?"
                          icon={<QuestionCircleOutlined style={{ color: 'gold' }} />}
                          onConfirm={() => handleRedeemReward(reward.id)}
                          okText="Yes"
                          cancelText="No"
                        >
                          <Button type="primary">
                            Redeem Now
                          </Button>
                        </Popconfirm>
                      )}
                      
                      {reward.quizResultId && (
                        <Button 
                          type="link" 
                          size="small"
                          onClick={() => navigate(`/quiz-time/results/${reward.quizResultId}`)}
                        >
                          View Quiz Result
                        </Button>
                      )}
                    </div>
                  </Card>
                ))}
            </div>
          )}
        </TabPane>
        
        <TabPane tab="Available" key="available">
          {getFilteredByStatus(false).length === 0 ? (
            <Empty
              description="No available rewards"
              image={Empty.PRESENTED_IMAGE_SIMPLE}
            />
          ) : (
            <div className={styles.rewardsGrid}>
              {getFilteredByStatus(false)
                .filter(reward => filterType === null || reward.type === filterType)
                .filter(reward => 
                  searchTerm === '' || 
                  reward.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                  reward.description.toLowerCase().includes(searchTerm.toLowerCase())
                )
                .map(reward => (
                  <Card key={reward.id} className={styles.rewardCard}>
                    <div className={styles.rewardHeader}>
                      <Tag color={getTypeColor(reward.type)} className={styles.rewardType}>
                        {reward.type}
                      </Tag>
                      <Badge status="success" text="Available" />
                    </div>
                    
                    <Title level={5} className={styles.rewardTitle}>
                      {reward.name}
                    </Title>
                    
                    <Paragraph className={styles.rewardDescription}>
                      {reward.description}
                    </Paragraph>
                    
                    <div className={styles.rewardMeta}>
                      {reward.expiresAt && (
                        <Text type="secondary" className={styles.expiryDate}>
                          Expires: {formatDate(reward.expiresAt)}
                        </Text>
                      )}
                      
                      {reward.value && (
                        <Text className={styles.rewardValue}>
                          Value: {reward.value}
                        </Text>
                      )}
                    </div>
                    
                    <Divider />
                    
                    <div className={styles.rewardActions}>
                      <Popconfirm
                        title="Redeem this reward?"
                        description="Are you sure you want to redeem this reward now?"
                        icon={<QuestionCircleOutlined style={{ color: 'gold' }} />}
                        onConfirm={() => handleRedeemReward(reward.id)}
                        okText="Yes"
                        cancelText="No"
                      >
                        <Button type="primary">
                          Redeem Now
                        </Button>
                      </Popconfirm>
                      
                      {reward.quizResultId && (
                        <Button 
                          type="link" 
                          size="small"
                          onClick={() => navigate(`/quiz-time/results/${reward.quizResultId}`)}
                        >
                          View Quiz Result
                        </Button>
                      )}
                    </div>
                  </Card>
                ))}
            </div>
          )}
        </TabPane>
        
        <TabPane tab="Redeemed" key="redeemed">
          {getFilteredByStatus(true).length === 0 ? (
            <Empty
              description="No redeemed rewards"
              image={Empty.PRESENTED_IMAGE_SIMPLE}
            />
          ) : (
            <div className={styles.rewardsGrid}>
              {getFilteredByStatus(true)
                .filter(reward => filterType === null || reward.type === filterType)
                .filter(reward => 
                  searchTerm === '' || 
                  reward.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                  reward.description.toLowerCase().includes(searchTerm.toLowerCase())
                )
                .map(reward => (
                  <Card key={reward.id} className={styles.rewardCard}>
                    <div className={styles.rewardHeader}>
                      <Tag color={getTypeColor(reward.type)} className={styles.rewardType}>
                        {reward.type}
                      </Tag>
                      <Badge status="default" text="Redeemed" />
                    </div>
                    
                    <Title level={5} className={styles.rewardTitle}>
                      {reward.name}
                    </Title>
                    
                    <Paragraph className={styles.rewardDescription}>
                      {reward.description}
                    </Paragraph>
                    
                    <div className={styles.rewardMeta}>
                      {reward.value && (
                        <Text className={styles.rewardValue}>
                          Value: {reward.value}
                        </Text>
                      )}
                    </div>
                    
                    <Divider />
                    
                    <div className={styles.rewardActions}>
                      <Text type="secondary">Redeemed</Text>
                      
                      {reward.quizResultId && (
                        <Button 
                          type="link" 
                          size="small"
                          onClick={() => navigate(`/quiz-time/results/${reward.quizResultId}`)}
                        >
                          View Quiz Result
                        </Button>
                      )}
                    </div>
                  </Card>
                ))}
            </div>
          )}
        </TabPane>
      </Tabs>
      
      <div className={styles.actions}>
        <Button type="default" icon={<HomeOutlined />} onClick={handleBackToHome}>
          Back to Home
        </Button>
        <Button type="primary" icon={<TrophyOutlined />} onClick={handleViewQuizzes}>
          Take More Quizzes
        </Button>
      </div>
    </div>
  );
};

// Helper function to get color for reward type
const getTypeColor = (type: string): string => {
  const colorMap: Record<string, string> = {
    'discount': 'blue',
    'freebie': 'green',
    'gift': 'gold',
    'experience': 'purple',
    'coupon': 'orange',
    'points': 'magenta'
  };
  
  return colorMap[type] || 'default';
};

// Helper function to format date
const formatDate = (dateString: string | Date): string => {
  const date = typeof dateString === 'string' ? new Date(dateString) : dateString;
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

export default RewardsPage; 