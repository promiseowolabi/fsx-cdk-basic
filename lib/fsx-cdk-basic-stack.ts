import { Duration, Resource, Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { aws_ec2 as ec2 } from 'aws-cdk-lib';
import * as cfninc from 'aws-cdk-lib/cloudformation-include';


export class FsxCdkBasicStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const defaultVpc = ec2.Vpc.fromLookup(this, 'VPC', { isDefault: true , region: 'eu-west-1'})
    const prefSubId = defaultVpc.publicSubnets[0]['subnetId']
    const standbySubId = defaultVpc.publicSubnets[1]['subnetId']
    const defaultSg = ec2.SecurityGroup.fromLookupByName(this, 'default SG', 'default', defaultVpc)
    const preferredSubnet = ec2.Subnet.fromSubnetId(this, 'PreferredSubnet', prefSubId)
    const standbySubnet = ec2.Subnet.fromSubnetId(this, 'StandbySubnet', standbySubId)

    const instance = new ec2.Instance(this, 'simple-instance-1', {
      vpc: defaultVpc,
      vpcSubnets: {
         subnetType: ec2.SubnetType.PUBLIC
      },
      //role: role,
      securityGroup: defaultSg,
      instanceName: 'simple-instance-1',
      instanceType: ec2.InstanceType.of( // t2.micro has free tier usage in aws
        ec2.InstanceClass.T2,
        ec2.InstanceSize.MICRO  
      ),
      machineImage: ec2.MachineImage.latestAmazonLinux({
        generation: ec2.AmazonLinuxGeneration.AMAZON_LINUX_2,
      }),
      keyName: 'irishkp',
    })

    const template = new cfninc.CfnInclude(this, 'Template', { 
      templateFile: 'lib/svm_volume.yaml',
      preserveLogicalIds: false,
      parameters: {
        "SecGroupId": defaultSg.securityGroupId,
        "PreferredSubId": preferredSubnet.subnetId,
        "StandbySubId": standbySubnet.subnetId,
      }
    });

    var fsId = (template.getResource('magentoFS'))
    var svmId = (template.getResource('magentoSVM'))
    var service = new String('.fsx.eu-west-1.amazonaws.com')

    var dnsName = svmId.ref.toString().concat('.', fsId.ref, service.toString())

    const mountPath = '/mnt/fsx';
    const mountName = '/datavol'

    instance.addUserData(
      'sudo su',
      'yum update -y',
      // Set up the directory to mount the file system to.
      `mkdir -p ${mountPath}`,
      // Set the file system up to mount automatically on start up and mount it.
      `echo "${dnsName}:${mountName} ${mountPath} nfs4" >> /etc/fstab`,
      'mount -a',
    ); 
  }
}